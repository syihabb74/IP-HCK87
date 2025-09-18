import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import http from "../utils/http";


const marketSlice = createSlice({
    name: 'market',
    initialState: {
        data: [],
        loading: false,
        error: '',
        lastUpdatedAt: Date.now() // Menggunakan timestamp (number) yang serializable
    }
    ,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchMarkets.pending, (state) => {
            state.loading = true,
            state.error = ''
        })
        builder.addCase(fetchMarkets.fulfilled, (state, actions) => {
            state.loading = false,
            state.data = actions.payload,
            state.lastUpdatedAt = Date.now() // Update timestamp ketika data berhasil di-fetch
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

        // Cek apakah data sudah ada dan masih fresh (kurang dari 5 menit)
        const currentState = thunkAPI.getState().market;
        if (currentState.data.length > 0 && (Date.now() - currentState.lastUpdatedAt < 5 * 60 * 1000)) {
            return currentState.data;
        }

        const {data} = await http({
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`
            },
            url: '/markets'
        });

        return data

    } catch (error) {

        throw error

    }
})