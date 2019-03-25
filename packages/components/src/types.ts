export interface IAuth {
    username: string,
    password: string,
    email: string,
    authtoken: string | null,
    error: string | null,
    loading: boolean
}

export interface IReduxState {
    auth: IAuth
}