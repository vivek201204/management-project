import axios from "axios"


export interface searchedItems {
    name : string
    email : string
    avatar : string | null
    id : string
}
export interface ReturnTypeSearchuser {
    status : boolean
    users : Array<searchedItems>
    message : string
}

export interface ReturnTypeSearchORgs {
    status : boolean
    orgs : Array<searchedItems>
    message : string
}
export const searchUser = async (query : string) => {
    const {data} : {data : ReturnTypeSearchuser} = await axios.get(`/api/search/get-searched-user?query=${query}`)
    return data
}

export const searchOrgs = async (query : string) => {
    const {data} : {data : ReturnTypeSearchORgs} = await axios.get(`/api/search/get-searched-org?query=${query}`)
    return data
}