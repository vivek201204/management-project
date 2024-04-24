"use client"
import React from 'react'
import { useForm } from 'react-hook-form'
import { useSocket } from '../../../custom-Hooks/SocketProvider'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../store/store'

function page() {
  const {register , handleSubmit} = useForm()
  const {sendMessage} = useSocket()
  const story = useSelector((state : RootState)=> state.story.story)
  if (!story) {
    return <div>Something went Wrong ! Story Not Found</div>
  }

  const sendMessages =  async(roomName : string , message : string) =>{
  const res  = await sendMessage(roomName , message) 
  console.log( "Message res" ,res);
  
}
const click = async(data : any) =>{
  await sendMessages(story.socketRoomName , data.msg )
}
  
  return (
    <>
    <div>chat page</div>
    <form onSubmit={handleSubmit(click)}>
     <input type="text" placeholder='send Message' {...register("msg")} />
     <button>Send Message</button>
    </form>

    <div>
      {}
    </div>
    </>
  )
}

export default page