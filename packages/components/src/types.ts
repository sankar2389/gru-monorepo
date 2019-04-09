export interface IAuth {
    authtoken: string | null,
    error: ISignupError | null
}

export interface IReduxState {
    auth: IAuth
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