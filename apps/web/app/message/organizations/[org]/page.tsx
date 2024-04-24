"use client"
import React from 'react'
import {useForm , SubmitHandler} from "react-hook-form"
import { useSocket } from '../../../custom-Hooks/SocketProvider'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../store/store'
import { useQuery } from '@tanstack/react-query'
import { getMessages } from '../../../../constants/MessagesQueryFN'
import Message from '../../Message'
import { useSession } from 'next-auth/react'
import { message } from '../../../custom-Hooks/SocketProvider'

interface dataTYpe {
    message : string
}

function page() {
    const {register , handleSubmit} = useForm<dataTYpe>()
    const {sendMessage , Messages} = useSocket()
    const org = useSelector((state : RootState)=> state.org.org)
    const {data} = useSession()
    if (!data) {
        return <div>please Login</div>
    }
    const user = data.user
    if (!org) {
        return <div>org nahi hai</div>
    }
    const {data : backendMessages , isLoading} = useQuery({
        queryKey : ["orgMessages"] ,
        queryFn : async () => await getMessages(org.socketRoomName)
    })

    if (isLoading) {
        return <div>Messages Loading</div>
    }

  

    const sendmessages : SubmitHandler<dataTYpe> = async (data ) => {
        const message : message = {
            content : data.message ,
            sender  : {
                avatar : user.avatar ,
                id : user.id ,
                name : user.name
            }
        }
        
     await sendMessage(org.socketRoomName , message)
    
     
    }

    const allMessages = [...(backendMessages ?? []) , ...(Messages ) ]
  return (
   
       
       <div className='relative flex flex-col min-h-screen'>
         
      
         <div className='bg-gray-200 p-4 rounded-lg shadow-md flex-1 overflow-auto'>
            {allMessages?.map((message)=>(
                <Message key={message.content} message={message} isOwner={message.sender.id === user.id} />
            ))}
         </div>
         

         <form onSubmit={handleSubmit(sendmessages)} className='flex items-center bg-white p-4 absolute bottom-0 left-0 right-0'>
            <input type="text" {...register("message")} placeholder=' Type a message...' className='flex-grow rounded-l-lg p-2 focus:outline-none focus:ring focus:border-blue-300 ' />
            <button className='bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300' type="submit">
                send
            </button>
        </form>
         
    </div>
  )
}

export default page