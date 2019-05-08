import { AnyAction } from 'redux'
import { IBuyOrSell } from '../types'

const initState: IBuyOrSell = {
    buyOrSellData: [],


}
export default (state: IBuyOrSell = initState, action: AnyAction): IBuyOrSell => {
    switch (action.type) {
        case 'BUY_DATA_LIST_SUCCESS':
            return {
                ...state,
                buyOrSellData: action.payload
            };

        default:
            return state;
    }
}