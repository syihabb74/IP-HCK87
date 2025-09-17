import {configureStore} from '@reduxjs/toolkit'
import { marketReducer } from '../slices/marketSlice'


const store = configureStore({
    reducer: {
        market : marketReducer 
    }
})

export default store