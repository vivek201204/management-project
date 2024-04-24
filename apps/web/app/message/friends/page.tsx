"use client"
import axios from 'axios'
import React from 'react'
import { useSocket } from '../../custom-Hooks/SocketProvider'
import { useForm } from 'react-hook-form'
import MessagesNavbar from '../MessagesNavbar'

function page() {
  const {joinRoom , sendMessage} = useSocket()
  const {register , handleSubmit} = useForm()
  let story : any ;
  const get = async() =>{
     story = await axios.get("/api/org/story/get-story?storyID=660036a74c9bb78ccf74c63a")
     await RoomJoin(story.data.story.socketRoomName)
  }
  const RoomJoin = async (roomName: string) => {
    const res = await joinRoom(roomName);
    console.log(`join Room Response ${res} `);
    return res;
  };

  const send = async(data : any) =>{
   if (story) {
     await sendMessage(story.socketRoomName , data.Message)
   }
  }

  return (
    <div>
      <MessagesNavbar />
      <button onClick={get}> Get Story</button>
        <form onSubmit={handleSubmit(send)} >
        <input  {...register("Message")}type="text" placeholder='Message' />
           <button>SendMessage</button>
        </form>
    </div>
  )
}

export default page