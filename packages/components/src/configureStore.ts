import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { combinedReducers, IRootState } from './reducers';
import logger from 'redux-logger';

export default function configureStore() {
    const store = createStore<IRootState, any, any, any>(combinedReducers, applyMiddleware(ReduxThunk, logger));
    return store;
}
