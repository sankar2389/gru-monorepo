import { AnyAction } from 'redux'
import { IBuyOrSell } from '../types'

const initState: IBuyOrSell = {
    buyOrSellData: [],
    bids: []
}
export default (state: IBuyOrSell = initState, action: AnyAction): IBuyOrSell => {
    switch (action.type) {
        case 'BUY_DATA_LIST_SUCCESS':
            return {
                ...state,
                buyOrSellData: action.payload
            };
        case "GET_BID_BY_ID_SUCCESS":
            console.log("reducer")
            return {
                ...state,
                bids: action.payload

            }

        default:
            return state;
    }
}