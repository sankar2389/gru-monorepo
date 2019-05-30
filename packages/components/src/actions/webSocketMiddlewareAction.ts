
export const webSocketMiddlewareConnectOrJoin = (type: string, groupName: string) => {
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

export const connecting = (dispatch: any) => {
    console.log("CONNECTING in action")
    dispatch({
        type: "CONNECTING"
    });
}

export const connected = (dispatch: any) => {
    console.log("connected in action")
    dispatch({
        type: "CONNECTED"
    });
}

export const disconnected = (dispatch: any) => {
    console.log("close in action")
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
    console.log("room members")
    return {
        type: "SOCKETIDS",
        payload: socketIds
    }
}

export function roomMember(socketId: string) {
    /*AsyncStorage.getItem(MEMBERS_KEY, (err, data) => {
        console.log(data);
        const socketIds = JSON.parse(data);
        socketIds.push(socketId);
    })*/
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