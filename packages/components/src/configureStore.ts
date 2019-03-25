import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { combinedReducers } from './reducers';
import logger from 'redux-logger';
import { IReduxState } from './types'

interface IRootState {
    auth: IReduxState
}

export default function configureStore() {
    const store = createStore<IRootState, any, any, any>(combinedReducers, applyMiddleware(ReduxThunk, logger));
    return store;
}
