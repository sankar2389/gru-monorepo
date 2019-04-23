export interface IAuth {
    authtoken: string | null,
    error: ISignupError | null
}

export interface IReduxState {
    auth: IAuth,
    group?: IGroup
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
    error: Error | null
}

export interface IGroupsInfo {
    groupName: string,
    users: string[]
}

export interface ICreateGrpError extends Error {}

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