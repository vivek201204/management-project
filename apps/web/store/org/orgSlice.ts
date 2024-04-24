import { Org } from "@prisma/client";
import { createSlice  , PayloadAction} from "@reduxjs/toolkit";
import { ORGExtends } from "../../constants/ExtendsOrgType";
import { orgs } from "../../constants/MessageQueryFn";

export interface org {
    status : boolean ,
    org : orgs | null
}

const initialState : org = {
    status : false ,
    org : null
}

const orgSlice = createSlice({
    name : "org" ,
    initialState ,
    reducers : {
        inOrg : (state  , action:PayloadAction<orgs>) =>{
            state.status = true ,
            state.org = action.payload
        } ,
        outOfOrg : (state) =>{
            state.status = false ,
            state.org = null
        }
    }
}) 
export const {inOrg , outOfOrg} = orgSlice.actions

export default orgSlice.reducer