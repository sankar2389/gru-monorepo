import { AnyAction } from 'redux'
import { IBuyOrSell } from '../types'

const initState: IBuyOrSell = {
    buyOrSellData: [],
    messageType: "",
    message: "",
    bids: []
}
export default (state: IBuyOrSell = initState, action: AnyAction): IBuyOrSell => {
    switch (action.type) {
        case 'CLEAR_BUY_OR_SELL_MESSAGE':
            return {
                ...state,
                messageType: "",
                message: "",
            };
        case 'BUY_DATA_LIST_SUCCESS':
            return {
                ...state,
                buyOrSellData: action.payload
            };

        case 'BUY_OR_SELL_DATA_CREATED_SUCCESS':
            return {
                ...state,
                messageType: action.messageType,
                message: action.message,
            };
        case 'BUY_OR_SELL_ERROR':
            return {
                ...state,
                messageType: action.messageType,
                message: action.message,
            };
        case "GET_BID_BY_ID_SUCCESS":
            return {
                ...state,
                bids: action.payload
            };
        case "BID_ACCEPTED_OR_REJECTED_SUCCESS":
            const bidData = action.payload
            return {
                ...state,
                bids: state.bids.filter(bid => bid._id !== bidData._id),
            }
        case "BID_ON_BUY_CREATED_SUCCESS":
            const updatedBuy = action.payload
            return {
                ...state,
                buyOrSellData: state.buyOrSellData.map(
                    data => (data._id === updatedBuy._id ? updatedBuy : data)
                ),
            }
        default:
            return state;
    }
}