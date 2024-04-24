import { Notification } from "@prisma/client"
import axios from "axios"


interface RetunTypeGetNotifications {
    messaeg : string 
    notifications :   Array<Notification>
    status : boolean
}

export const getNotifications = async() =>{
    const {data} : {data : RetunTypeGetNotifications} = await axios.get("/api/notifications/get-notifications")

    return data
}