
export const webSocketMiddlewareConnectOrJoin = (type: string, groupName: string) => {
    console.log("type", type)
    return (dispatch: Function) => {
        dispatch({
            type: type,
            groupName: groupName
        })
    }
}
export const webSocketDisconnect = (type: string) => {
    return (dispatch: Function) => {
        dispatch({
            type: type
        })
    }
}

export const webSocketConnect = (type: string, socketId: any) => {
    return (dispatch: Function) => {
        dispatch({
            type: type,
            payload: socketId
        })
    }
}

export const onSendMessage = (type: string, message: string) => {
    return (dispatch: Function) => {
        dispatch({
            type: type,
            payload: message
        })
    }
}

export const connecting = (dispatch: any) => {
    dispatch({
        type: "CONNECTING"
    });
}

export const connected = (dispatch: any) => {
    dispatch({
        type: "CONNECTED"
    });
}

export const disconnected = (dispatch: any) => {
    dispatch({
        type: "DISCONNECTED"
    });
}

export const roomJoin = (dispatch: any) => {
    dispatch({
        type: "ROOM_JOIN"
    });
}
export function roomMembers(socketIds: string) {
    return {
        type: "SOCKETIDS",
        payload: socketIds
    }
}

export function roomMember(socketId: string) {
    return {
        type: "SOCKETIDS",
        payload: socketId
    }
}

export function incommingMessage(from: string, message: string) {
    return {
        type: "MESSAGE",
        payload: {
            from,
            message
        }
    }
}

export function datachannelOpened() {
    return {
        type: "DATACHAN_STAT",
        payload: true
    }
}