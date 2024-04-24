'use client';

import { PayloadAction, createSlice } from '@reduxjs/toolkit';


export interface CounterState {
    value: string
}

const initialState: CounterState = {
    value: ""
}

export const counterSlice = createSlice({
    name: 'input',
    initialState,
    reducers: {
        takeInput: (state, action : PayloadAction<string>) => {
            state.value = action.payload
        }
    }
})

export const { takeInput } = counterSlice.actions;

export const reducer =  counterSlice.reducer;