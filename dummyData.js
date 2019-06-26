const axios = require("axios");

// Add Dummy users

// ! CHANGE THESE ===========================
const headers = {
  Authorization:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZDA4NzE4ODE2N2Q3YjJmZjg2YzUwODQiLCJpZCI6IjVkMDg3MTg4MTY3ZDdiMmZmODZjNTA4NCIsImlhdCI6MTU2MDgzNjQ4NiwiZXhwIjoxNTYzNDI4NDg2fQ.Z-0gZTh9c7V8lQxnRzmjRDjCowiWhZ94RchA4-Jm834"
};

const creatorObject = {
  _id: "5d087188167d7b2ff86c5084",
  confirmed: true,
  blocked: false,
  username: "ayanrocks5",
  email: "ayanb1999@gmail.com",
  provider: "local",
  role: {
    _id: "5d086de2167d7b2ff86c4f6a",
    name: "Administrator",
    description: "These users have all access in the project.",
    type: "root",
    __v: 0
  },
  __v: 0
};

const username = "ayanb1999@gmail.com";

// ==================================================================================

function randomNameGenerator() {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < 7; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function randomNumberGenerator() {
  return Math.floor(Math.random() * 90000) + 10000;
}

function init() {
  const args = process.argv.slice(2);

  if (args.length === 1) {
    switch (args[0].toLowerCase()) {
      case "users":
        users();
        break;
      case "buys":
        buys();
        break;
      case "sells":
        sells();
        break;
      case "groups":
        groups();
        break;
    }
  } else {
    users();
    buys();
    groups();
    sells();
  }
}

function users() {
  // Add Random dummy Users

  console.log("Adding Users");

  for (let i = 0; i <= 20; i++) {
    axios
      .post("http://localhost:1337/auth/local/register", {
        username: randomNameGenerator(),
        email: randomNameGenerator() + "@test.com",
        password: 1234
      })
      .catch(e => {
        throw e;
      });
  }
}

function buys() {
  // Add buy dummy data
  console.log("Adding Buys");

  for (let i = 0; i <= 20; i++) {
    axios
      .post(
        "http://localhost:1337/buys",
        {
          creator: username,
          unit: "gram",
          quantity: 500,
          price: randomNumberGenerator(),
          creatorObject: creatorObject
        },
        {
          headers: headers
        }
      )
      .catch(e => {
        console.log("Error");
      });
  }
}

function sells() {
  // Add Sell Dummy Data
  console.log("Adding Sells");

  for (let i = 0; i <= 20; i++) {
    axios
      .post(
        "http://localhost:1337/sells",
        {
          creator: username,
          unit: "gram",
          quantity: 500,
          price: randomNumberGenerator(),
          creatorObject
        },
        {
          headers: headers
        }
      )
      .catch(e => {
        console.log("Error");
      });
  }
}

function groups() {
  console.log("Adding Groups");

  for (let i = 0; i <= 20; i++) {
    axios
      .post(
        "http://localhost:1337/groups",
        {
          creator: username,
          groupName: randomNameGenerator(),
          members: {
            username: "ayanrocks5",
            email: "ayanb1999@gmail.com",
            blocked: false,
            __typename: "UsersPermissionsUser"
          }
        },
        {
          headers: headers
        }
      )
      .catch(e => {
        console.log("Error");
      });
  }
}

init();
