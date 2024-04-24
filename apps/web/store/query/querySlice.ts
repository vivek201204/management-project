import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface initialstate {
    status : boolean 
    query : string | null
}

const initialState : initialstate ={
    status:false,
    query:  null
}

const querySlice=createSlice({
    name:"query",
    initialState,
    reducers:{
        inQuery:(state,action:PayloadAction<string> )=>{
            state.status=true,
            state.query=action.payload
        },
        notinquery:(state)=>{
            state.status=false,
            state.query=null
        }
    }
})

export const {inQuery , notinquery} = querySlice.actions
export default querySlice.reducer