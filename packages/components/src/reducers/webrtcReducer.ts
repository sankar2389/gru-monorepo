import { AnyAction } from 'redux'
import { IWEBRTC } from '../types'

const initState: IWEBRTC = {
    connected: false,
    room_joined: false
}
export default (state: IWEBRTC = initState, action: AnyAction): IWEBRTC => {
    switch (action.type) {
        case 'CONNECTED':
            console.log("CONNECTED")
            return {
                ...state,
                connected: true
            };
        case "DISCONNECTED":
            console.log("DISCONNECTED")
            return { ...state, connected: false, room_joined: false };

        default:
            return state;
    }
}