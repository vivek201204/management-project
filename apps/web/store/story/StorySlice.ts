import { Story } from "@prisma/client";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface stateTypes {
    status : boolean ,
    story : Story | null
}

const initialState : stateTypes = {
    status : false ,
    story : null
}

const storySlice = createSlice({
    name : "stroy" ,
    initialState ,
    reducers : {
        inStory : (state , action : PayloadAction<Story>) =>{
          state.status  = true ,
          state.story = action.payload
        } ,
        outStory : (state) =>{
         state.status = false ,
         state.story = null
        }
    }
})
export  const {inStory , outStory} = storySlice.actions
export default storySlice.reducer
