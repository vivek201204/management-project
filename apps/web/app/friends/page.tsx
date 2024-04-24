"use client"
import { User } from '@prisma/client'
import axios from 'axios'
import React, { useState } from 'react'
import { AppDispatch } from '../../store/store'
import { useDispatch } from 'react-redux'
import { inFriendPage } from '../../store/friends/friendSlice'
import { useRouter } from 'next/navigation'
import { useSocket } from '../custom-Hooks/SocketProvider'
import { useForm } from 'react-hook-form'
import { find } from '../my-components/Find'

function Friends() {

  const [friends , setFriends] = useState<Array<User>>()
  const [User , setUser] = useState<User>()
  const dispatch : AppDispatch = useDispatch()
  const fetch = async () =>{
    const res = await axios.get("/api/friends/get-friends")
    console.log(res);
    if (res) {
      setFriends(res.data.profile.friends)
    }
    
  }
  const router = useRouter()
  const {joinRoom } = useSocket()
  const {register , handleSubmit} = useForm()


  const searchUser = async(data: any) =>{
   const user = await find(data.name)
   if (user === null) {
    return null
   }
   setUser(user)
   return user
  }

  const makeFriend = async() =>{
    const res = await axios.post(`/api/friends/toggleFriends?friendID=${User?.id}`)
    console.log(res);
    
  }

  const RoomJoin = async (roomName : string) =>{
    const res =  await joinRoom(roomName)
    console.log("roomJoin status" , res);
    
    return res
  }

  const vistFriend = async(friend : User) =>{
   dispatch(inFriendPage(friend))
   const RoomName  = friend.id
    const res = await RoomJoin(RoomName)
     if (res) {
      router.push(`/friends/${friend.id}`)
     
     }
     
  }

  return (
  <>
    <button onClick={fetch} >Fetch Friends</button>

    <h1>{User?.name}</h1>
    <button onClick={makeFriend} >Make Friend</button>

   <form onSubmit={handleSubmit(searchUser)}>
   <input type="text" placeholder='search User ' {...register("name")} />
    <button>Search</button>
   </form>

    <div>
   {friends?.map((friend)=>(
    <>
    <button onClick={async ()=> await vistFriend(friend)} key={friend.id}>friendName  = {friend.name}</button>
      <br />
      </>
    ))}
    </div>
    </>
  )
}

export default Friends