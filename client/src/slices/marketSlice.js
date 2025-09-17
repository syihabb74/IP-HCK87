import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import http from "../utils/http";


const marketSlice = createSlice({
    name: 'market',
    initialState: {
        data: [],
        loading: false,
        error: ''
    }
    ,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchMarkets.pending, (state) => {
            state.loading = true,
            state.error = ''
        })
        builder.addCase(fetchMarkets.fulfilled, (state, actions) => {
            state.loading = true,
            state.data = actions.payload
        })
        builder.addCase(fetchMarkets.rejected, (state) => {
            state.loading = false
        })
    }
})


export const marketActions = marketSlice.actions
export const marketReducer = marketSlice.reducer

export const fetchMarkets = createAsyncThunk('market/fetchMarkets', async function fetchMarkets(params, thunkAPI) {
    try {

        const {data} = await http({
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`
            },
            url: '/markets'
        });

        return data

    } catch (error) {

        console.error(error);

        throw error

    }
})