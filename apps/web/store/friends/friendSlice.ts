import { User } from "@prisma/client";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface intialDataTypes {
    status : boolean 
    friend : User | null
}

const initialData : intialDataTypes = {
   status : false,
   friend : null
}

const friendSlice = createSlice({
    name :"friend",
    initialState : initialData ,
    reducers : {
        inFriendPage : (state  , action : PayloadAction<User>) =>{
            state.status = true ,
            state.friend = action.payload
        }
    }
})

export const {inFriendPage} = friendSlice.actions

export default friendSlice.reducer