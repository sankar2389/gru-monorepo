import { AsyncStorage } from 'react-native';
import io from 'socket.io-client';
import { connecting, connected, disconnected, roomMembers, roomMember, roomJoin } from '../../actions/index';

export const MEMBERS_KEY = '@RNAWebRTCApp:room_members';
export const ROOMS_KEY = '@RNAWebRTCApp:rooms';

const webSocketMiddleware = (function () {
    let socket: any

    const onOpen = (store: any) => (evt: any) => {
        console.log("open")
        store.dispatch(connected);
    }

    const onClose = (store: any) => (evt: any) => {
        console.log("closeeeeeeeeeeeeeeeeeeeeee")
        //Tell the store we've disconnected
        store.dispatch(disconnected);
    }

    const onExchangeMessage = (store: any) => (data: any) => {
        // exchange webrtc data
        store.dispatch({ type: "WEBTRC_EXCHANGE", payload: data });
    }

    const onMembers = (store: any) => (socketId: any) => {
        console.log("socketId", socketId);
        let socketIds: any;
        AsyncStorage.getItem(MEMBERS_KEY, (err, data: any) => {
            if (data !== null) {
                socketIds = JSON.parse(data);
            }
            socketIds.push(socketId);
            AsyncStorage.setItem(MEMBERS_KEY, JSON.stringify(socketIds));
            store.dispatch(roomMembers(socketIds));
        })
    }
    return (store: any) => (next: any) => (action: any) => {
        //console.log(action);
        switch (action.type) {
            case "CONNECT":
                //Start a new connection to the server
                console.log("socket", socket)
                if (socket !== undefined) {
                    socket.close();
                }
                //Send an action that shows a "connecting..." status for now
                store.dispatch(connecting);

                //Attempt to connect (we could send a 'failed' action on error)
                socket = io.connect('http://localhost:1337', { transports: ['websocket'] });
                socket.on('connect', onOpen(store));
                socket.on('leave', onClose(store));
                socket.on('exchange', onExchangeMessage(store));
                socket.on('new_member', onMembers(store));
                break;

            //The user wants us to disconnect
            case "DISCONNECT":
                if (socket !== undefined || socket !== null) {
                    socket.close();
                }
                socket = null;
                store.dispatch(disconnected);
                break;

            //Send the 'SEND_MESSAGE' action down the websocket to the server
            case "EXCHANGE":
                socket.emit('exchange', action.payload);
                break;
            case "JOIN":
                socket.emit('join', action.payload, (socketIds: any) => {
                    store.dispatch(roomJoin);
                    AsyncStorage.setItem(MEMBERS_KEY, JSON.stringify(socketIds));
                    store.dispatch(roomMembers(socketIds));
                });
                break;
            //This action is irrelevant to us, pass it on to the next middleware
            default:
                return next(action);
        }
    }
})();
export default webSocketMiddleware;




