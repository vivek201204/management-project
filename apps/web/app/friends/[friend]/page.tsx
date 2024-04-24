"use client"
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store/store'
import { useSocket } from '../../custom-Hooks/SocketProvider'
import { useForm } from 'react-hook-form'


 function page() {

    const friend = useSelector((state : RootState)=> state.friend.friend)
    if (!friend) {
        return (
            <h1>
                Does not get Friend
            </h1>
        )
    }
    const {register , handleSubmit} = useForm()

    const {sendMessage } = useSocket()
   
    

    const sendMSg = async(message : string) =>{
       const res = await sendMessage(friend.id , message )
       console.log(`message res ${res}`);
       
       return res
    }

    const send = async (data : any) =>{
       const res =  await sendMSg(data.message)
       console.log(`send fn res ${res}`);
       
    }

  return (
    <>
    <div>Chat with {friend.name}</div>
    <form onSubmit={handleSubmit(send)}>
        <input type="text" placeholder='enter message' {...register("message")} />
        <button>Send Message</button>
    </form>
    </>
  )
}

export default page