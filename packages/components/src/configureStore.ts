import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { combinedReducers, IRootState } from './reducers';
import logger from 'redux-logger';
import webSocketMiddleware from "../src/components/common/webSocketMiddleware"

export default function configureStore() {
    const store = createStore<IRootState, any, any, any>(combinedReducers, applyMiddleware(ReduxThunk, logger, webSocketMiddleware));
    return store;
}
