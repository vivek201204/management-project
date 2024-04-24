"use client"
import {configureStore} from "@reduxjs/toolkit"
import StoryReducer from "../story/StorySlice"
import orgSlice from "../org/orgSlice"
import authSlice from "../auth/authSlice"

const reduxStore = configureStore({
    reducer : {
    story : StoryReducer ,
    auth : authSlice ,
    org : orgSlice
    }
})

export {reduxStore}
 
export type ReduxRootState = ReturnType<typeof reduxStore.getState>;
export type ReduxAppDispatch = typeof reduxStore.dispatch;