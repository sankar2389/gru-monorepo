
import io from 'socket.io-client';
import { connecting, connected, disconnected, roomMembers, roomJoin } from "../../actions/webSocketMiddlewareAction"


import { AsyncStorage } from 'react-native';

export const MEMBERS_KEY = '@RNAWebRTCApp:room_members';
export const ROOMS_KEY = '@RNAWebRTCApp:rooms';

const webSocketMiddleware = (function () {
    let socket = io.connect(' http://localhost:1337', { transports: ['websocket'] });

    const onOpen = (store: any) => (evt: any) => {
        //Send a handshake, or authenticate with remote end
        //Tell the store we're connected
        store.dispatch(connected);
    }
    const onClose = (store: any) => (evt: any) => {
        //Tell the store disconnected
        store.dispatch(disconnected);
    }

    // const onExchangeMessage = (store:any) => (data:any) => {
    // 	// exchange webrtc data
    // 	//store.dispatch({ type: WEBTRC_EXCHANGE, payload: data });
    // }

    const onMembers = (store: any) => (socketId: string) => {
        console.log(socketId);
        let socketIds: any = [];
        AsyncStorage.getItem(MEMBERS_KEY, (err: any, data: any) => {
            console.log("dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", data)
            if (data !== null) {
                socketIds = JSON.parse(data);
            }
            socketIds.push(socketId);
            AsyncStorage.setItem(MEMBERS_KEY, JSON.stringify(socketIds));
            store.dispatch(roomMembers(socketIds));
        })

    }

    return (store: any) => (next: any) => (action: any) => {
        console.log(action);
        switch (action.type) {
            case "CONNECT":
                socket.on('connect', onOpen(store));

                //Start a new connection to the server
                if (socket !== null) {
                    socket.close();
                }
                //Send an action that shows a "connecting..." status for now
                store.dispatch(connecting);
                //Attempt to connect (we could send a 'failed' action on error)
                socket = io.connect(' http://localhost:1337', { transports: ['websocket'] });
                socket.on('connect', onOpen(store));
                //socket.on('leave', onClose(store));
                //socket.on('exchange', onExchangeMessage(store));
                // socket.on('new_member', onMembers(store));

                break;
            case "JOIN":
                socket.emit('join', action.payload, (socketIds: any) => {
                    console.log("Join")
                    console.log("Join", action.payload)

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