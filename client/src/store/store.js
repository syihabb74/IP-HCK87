import {configureStore} from '@reduxjs/toolkit'
import { marketReducer } from '../slices/marketSlice'
import { walletReducer } from '../slices/walletSlice'


const store = configureStore({
    reducer: {
        market : marketReducer ,
        wallet : walletReducer
    }
})

export default store