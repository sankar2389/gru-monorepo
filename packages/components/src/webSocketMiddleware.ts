import { AsyncStorage } from 'react-native';
import io from 'socket.io-client';
import { connecting, connected, disconnected, roomMembers, roomMember, roomJoin } from './actions/index';
import { string } from 'prop-types';

export const MEMBERS_KEY = '@RNAWebRTCApp:room_members';
export const ROOMS_KEY = '@RNAWebRTCApp:rooms';
const SOCKET_SERVER_API = process.env.SOCKET_SERVER_API;

const webSocketMiddleware = (function () {
    let socket: any

    const onOpen = (store: any) => (evt: any) => {
        store.dispatch(connected);
    }

    const onClose = (store: any) => (evt: any) => {
        //Tell the store we've disconnected
        store.dispatch(disconnected);
    }

    const onExchangeMessage = (store: any) => (data: any) => {
        store.dispatch({ type: "WEBTRC_EXCHANGE", payload: data });
    }

    const onMembers = (store: any) => (socketId: any) => {
        let socketIds: any;
        AsyncStorage.getItem(MEMBERS_KEY, (err, data: any) => {
            if (data && data !== null) {
                socketIds = JSON.parse(data);
            }
            socketIds.push(socketId);
            //socketIds = socketIds.filter((socket: string) => socket === socketId),
            AsyncStorage.setItem(MEMBERS_KEY, JSON.stringify(socketIds));
            store.dispatch(roomMembers(socketIds, socketId));
        })
    }
    return (store: any) => (next: any) => (action: any) => {
        switch (action.type) {
            case "CONNECT":
                console.log("connect")
                // Start a new connection to the server
                if (socket !== undefined && socket !== null) {
                    socket.close();
                }
                store.dispatch(connecting);
                try {
                    //Attempt to connect (we could send a 'failed' action on error)
                    AsyncStorage.getItem('token').then(token => {
                        socket = io(SOCKET_SERVER_API + '', {
                            query: { token: token },
                            transports: ['websocket']
                        });
                        socket.on('connect', onOpen(store));
                        socket.on('leave', onClose(store));
                        socket.on('exchange', onExchangeMessage(store));
                        socket.on('new_member', onMembers(store));
                    })
                } catch (error) {
                    console.error(error)
                }
                break;
            case "DISCONNECT":
                // The user wants us to disconnect
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
                if (socket !== undefined) {
                    socket.emit('join', action.groupName, (socketIds: any) => {
                        store.dispatch(roomJoin);
                        AsyncStorage.setItem(MEMBERS_KEY, JSON.stringify(socketIds));
                        store.dispatch(roomMembers(socketIds, ""));
                    });
                }
                break;
            //This action is irrelevant to us, pass it on to the next middleware
            default:
                return next(action);
        }
    }
})();
export default webSocketMiddleware;




