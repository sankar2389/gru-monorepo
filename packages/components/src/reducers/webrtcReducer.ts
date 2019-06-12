import { AnyAction } from 'redux'
import { IWebrtc } from '../types'

const initState: IWebrtc = {
    connected: false,
    socketids: [],
    socketid: "",
    message: {},
    datachan_stat: false,
    room_joined: false
}
export default (state: IWebrtc = initState, action: AnyAction): IWebrtc => {
    switch (action.type) {
        case "CONNECTED":
            return { ...state, connected: true };
        case "DISCONNECTED":
            return { ...state, connected: false, room_joined: false, socketids: [] };
        case "SOCKETIDS":
            return { ...state, socketids: action.payload, socketid: action.socketId };
        case "MESSAGE":
            return { ...state, message: action.payload };
        case "DATACHAN_STAT":
            return { ...state, datachan_stat: action.payload };
        case "ROOM_JOIN":
            return { ...state, room_joined: true };
        default:
            return state;
    }
}


