import createApolloClient from '../apollo';
import gql from 'graphql-tag';
import { AsyncStorage } from 'react-native';
import axios, { AxiosError } from 'axios';
const CMS_API = process.env.CMS_API;

export const webSocketMiddlewareConnectOrJoin = (type: string, groupName: string) => {
    return (dispatch: Function) => {
        dispatch({
            type: type,
            groupName: groupName
        })
    }
}
export const webSocketDisconnect = () => {
    return (dispatch: Function) => {
        dispatch({
            type: "DISCONNECT"
        })
    }
}

export const webSocketConnect = (socketId: any) => {
    return (dispatch: Function) => {
        dispatch({
            type: "CREATE_OFFER",
            payload: socketId
        })
    }
}

export const onSendMessage = (groupId: string, message: string) => {
    return (dispatch: Function) => {
        let messageData = {
            groupId: groupId,
            message: message
        }
        dispatch({
            type: "SEND_MESSAGE",
            payload: messageData,

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
export function roomMembers(socketIds: string, socketId: any) {
    return {
        type: "SOCKETIDS",
        payload: socketIds,
        socketId: socketId
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
export const saveSocketIdInUser = (_id: any, socketId: any) => {
    return (dispatch: Function) => {
        AsyncStorage.getItem('token')
            .then((authtoken: string | null) => {
                if (authtoken) {
                    if (authtoken) {
                        if (authtoken) {
                            const client = createApolloClient(authtoken);
                            client.mutate({
                                mutation: gql`
                             mutation ($input: updateUserInput) {
                                 updateUser(input: $input) {
                                  user {
                                    socketId
                                  }
                                }
                              }
                             `,
                                variables: {
                                    "input": {
                                        "where": {
                                            "id": _id
                                        }, "data": {
                                            "socketId": socketId
                                        }
                                    }
                                }
                            })
                        }
                    }

                }
            })
    }
}

export const removeSocketIdInUser = (_id: any, ) => {
    return (dispatch: Function) => {
        AsyncStorage.getItem('token')
            .then((authtoken: string | null) => {
                if (authtoken) {
                    if (authtoken) {
                        if (authtoken) {
                            const client = createApolloClient(authtoken);
                            client.mutate({
                                mutation: gql`
                             mutation ($input: updateUserInput) {
                                 updateUser(input: $input) {
                                  user {
                                    socketId
                                  }
                                }
                              }
                             `,
                                variables: {
                                    "input": {
                                        "where": {
                                            "id": _id
                                        }, "data": {
                                            "socketId": ""
                                        }
                                    }
                                }
                            })
                        }
                    }

                }
            })
    }
}

