import { User } from "@prisma/client"
import {PayloadAction, createSlice} from "@reduxjs/toolkit"

export interface TaskData {
  status : boolean 
  Employee : User | null
}

const data : TaskData = {
   status : false ,
   Employee : null
}

const TaskSlice = createSlice({
    name : "task" ,
    initialState : data ,
    reducers : {
        newEmployee : (state , action: PayloadAction<User>) =>{
         state.status = true 
         state.Employee = action.payload
        }
    }
})

export const {newEmployee} = TaskSlice.actions

export default TaskSlice.reducer