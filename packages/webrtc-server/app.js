var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var Storage = require('node-storage');
const axios = require('axios');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var options = {
  key: fs.readFileSync('./fake-keys/privatekey.pem'),
  cert: fs.readFileSync('./fake-keys/certificate.pem')
};
var store = new Storage('./peers.db')
var serverPort = (process.env.PORT || 4443);
var https = require('https');
var http = require('http');
var server;
if (process.env.LOCAL) {
  server = https.createServer(options, app);
} else {
  server = http.createServer(app);
}
var io = require('socket.io')(server);

var roomList = {};

app.post('/api/setUser', function (req, res, next) {
  console.log('POST /api/setUser', req.body);
  res.json({ some: 'json' });
  next();
});

server.listen(serverPort, function () {
  console.log('server up and running at %s port', serverPort);
});

function socketIdsInRoom(name) {
  var socketIds = io.nsps['/'].adapter.rooms[name];
  if (socketIds) {
    var collection = [];
    for (var key in socketIds) {
      collection.push(key);
    }
    return collection;
  } else {
    return [];
  }
}

io.use(async (socket, next) => {
  if (socket.handshake.query && socket.handshake.query.token) {
    try {
      const res = await axios.get('http://localhost:1337/users/me', { headers: { Authorization: 'Bearer ' + socket.handshake.query.token } });
      console.info('User authenticated');
      return next();
    } catch (error) {
      console.error(error);
      return next(new Error('authentication error'));
    }
  }
})
  .on('connection', (socket) => {
    console.info('user connection created');
    socket.on('disconnect', function () {
      if (socket.room) {
        var room = socket.room;
        io.to(room).emit('leave', socket.id);
        socket.leave(room);
      }
      console.info('user disconnected');
    });

    socket.on('join', (name, callback) => {
      console.info('join', name);
      var socketIds = socketIdsInRoom(name);
      callback(socketIds);
      socket.join(name);
      socket.room = name;
      io.to(socket.room).emit('new_member', socket.id);
    });


    socket.on('exchange', (data) => {
      console.log('exchange received', data);
      data.from = socket.id;
      var to = io.sockets.connected[data.to];
      var from = io.sockets.connected[data.from];
      to.emit('exchange', data);
    });

    socket.on('setUser', (req, callback) => {
      const socketId = req.socketId;
      const deviceId = req.device_id;
      const userName = req.username;
      console.log('set user', userName);
      store.put(socketId, { userName, deviceId })
    });
    socket.on('getUser', (socket_id, callback) => {
      console.log('finsing user using socketid', socket_id);
      // find userInfo using socketid
      store.get(socket_id);
    });
  });
