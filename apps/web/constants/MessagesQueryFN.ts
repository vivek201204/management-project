import axios from "axios"


export interface Imessage {
    content  : string
   
    
    sender  : user
    
}


interface user {
    name : string
    avatar : string | null
    id : string
}

interface getMessagesReturnTYpe {
    message : string
    messages : Array<Imessage>
}

export const getMessages = async (GroupName : string) => {
    const {data} : {data : getMessagesReturnTYpe} = await axios.get(`/api/messages/get-messages?GroupName=${GroupName}`)
    return data.messages
}