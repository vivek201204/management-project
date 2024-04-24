"use client"
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { useSocket } from '../custom-Hooks/SocketProvider'
import { string } from 'zod'
import { Task } from '@prisma/client'

interface respone {
  message : string 
  task : Task
}

function page() {
    const employye = useSelector((state : RootState)=> state.task.Employee)
    const story = useSelector((state : RootState) => state.story.story)
    const router = useRouter()
    if (!employye && story) {
        router.push("/")
    }
   const {joinRoom} = useSocket()
    const RoomJoin = async(roomName : string) =>{
      const res = await joinRoom(roomName)
      console.log(`room status ${res} ` );
      return res
    }


    const {register , handleSubmit} = useForm()
    const give = async(dataa : any) =>{
      const {data} : {data : respone} = await axios.post(`/api/org/story/task/create-task?reciverID=${employye?.id}&storyID=${story?.id}` , dataa )

      console.log(data);
      if (data.task) {
        if (data.task.TaskSocketRoomName !== null) {
          const res = await RoomJoin(data.task.TaskSocketRoomName)
          console.log(`if wala res ${res}`);
          
        }
        
      }
      
  

    }
  return (
    <>
    <div>employee Name {employye?.name}</div>
    <form onSubmit={handleSubmit(give)}>
    <input type="text" placeholder='title' {...register("title")} />
    <input type="text" placeholder='content' {...register("content")} />
    <button>Give tasks</button>
    </form>
    </>
  )
}

export default page