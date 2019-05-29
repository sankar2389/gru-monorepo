
export const webSocketMiddleware = (type: string, groupName: string) => {
    return (dispatch: Function) => {
        dispatch({
            type: type,
            groupName: groupName
        })
    }
}

export const connecting = () => {
    console.log("connecting");
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

export const roomMembers = (socketIds: string) => {
    console.log("SocketIDdddddddddddddddddddd")
    console.log("SocketIDdddddddddddddddddddd", socketIds)
}

export const roomJoin = (dispatch: any) => {
    console.log("room join")
    dispatch({
        type: "ROOM_JOIN"
    });
}