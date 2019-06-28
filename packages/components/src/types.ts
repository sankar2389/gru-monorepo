export interface IAuth {
    authtoken: string | null,
    error: ISignupError | null,
    onToggleSideBar: boolean | null,
    range1: number | null, range2: number | null
}

export interface IReduxState {
    auth: IAuth,
    group?: IGroup,
    buyOrSell?: any[],
    webrtc?: any[]
}

export interface ISignup {
    username: string,
    email: string,
    password: string
}
export interface ILogin {
    email: string,
    password: string
}

export interface IForgotPass {
    email: string
}

export interface ISignupError {
    error: string,
    message: string,
    statusCode: number
}

export interface IRootState {
    app: IReduxState
}

export interface IGroup {
    groups: IGroupsInfo[],
    questions: any[],
    questionDetails: any,
    error: Error | null,
    commentDetail: any
}

export interface IWebrtc {
    connected: boolean,
    room_joined: boolean,
    socketids: any,
    socketId: string,
    message: any,
    datachan_stat: boolean,
}


export interface IGroupsInfo {
    _id: string,
    groupName: string,
    creator: string,
    createdAt: any,
    users: string[],
    members: any[],
    socketid?: string,
    connected?: boolean
}

export interface ICreateGrpError extends Error { }

export interface InterfaceGRC {
    goldRate: number,
    duty: number,
    gst: number,
    profit: number,
    fiatRate: number,
    goldOunce: number
}

export interface IStrapiUser {
    blocked?: string | null,
    confirmed: number,
    email: string,
    id: number,
    username: string
}

export interface IBuyOrSell {
    buyOrSellData: any[],
}
// export interface ICreateSell {
//     buyOrsell: string,
//     price: string,
//     creator: string
// }