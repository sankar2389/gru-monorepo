import { AnyAction } from 'redux'
import { IWEBRTC } from '../types'

const initState: IWEBRTC = {
    connected: false,
    socketids: [],
    message: {},
    datachan_stat: false,
    room_joined: false
}
export default (state: IWEBRTC = initState, action: AnyAction): IWEBRTC => {
    switch (action.type) {
        case "CONNECTED":
            console.log("in reducer connected")
            return { ...state, connected: true };
        case "DISCONNECTED":
            return { ...state, connected: false, room_joined: false };
        case "SOCKETIDS":
            return { ...state, socketids: action.payload };
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


