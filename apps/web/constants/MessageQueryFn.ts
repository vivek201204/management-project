import axios from "axios"


export interface orgs {
    avatar : string | null ,
    id : string ,
    name : string ,
    headline : string | null ,
    socketRoomName : string,
    employeeID : Array<string>
}
interface ReturnTYpe {
    orgs  : Array<orgs>
    message : string
}

export const getOrgsMEssage  = async() => {
    const {data} : {data : ReturnTYpe} = await axios.get("/api/org/get-orgs")
    return data.orgs
}