import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import http from "../utils/http";

const walletSlice = createSlice({
    name : 'wallet',
    initialState : {
        data : [],
        loading : false,
        error : ''
    },
    reducers : {},
    extraReducers : builder => {
        builder.addCase(fetchWallet.pending, (state) => {
            state.loading = true,
            state.error = ''
        })
        builder.addCase(fetchWallet.fulfilled, (state, actions) => {
            state.loading = false,
            state.data = actions.payload
        })
        builder.addCase(fetchWallet.rejected, (state, actions) => {
            state.loading = false
        })
    }
})

export const walletActions = walletSlice.actions;
export const walletReducer = walletSlice.reducer

export const fetchWallet = createAsyncThunk('wallet/fetchWallets', async function fetchMarkets(params,thunkAPI) {
    try {

        console.log('sadjfklasjdflkjasdfdsfjalskdfjlkasdjflkasdjfl;asdfjl')
        
        const {data} = await http({
            method : 'GET',
            url : '/wallets',
            headers : {
                Authorization : `Bearer ${localStorage.getItem('access_token')}`
            }
        })

        return data

    } catch (error) {
        
        console.log(error);
        throw error

    }
})