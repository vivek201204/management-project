"use client"
import React from 'react'
import MessagesNavbar from '../MessagesNavbar'
import { useQuery } from '@tanstack/react-query'
import { getOrgsMEssage } from '../../../constants/MessageQueryFn'
import { useSocket } from '../../custom-Hooks/SocketProvider'
import { Avatar } from '@mui/material'
import { orgs } from '../../../constants/MessageQueryFn'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../store/store'
import { inOrg } from '../../../store/org/orgSlice'
import { useQueryClient } from '@tanstack/react-query'


function page() {

    const {data : orgs , isLoading} = useQuery({
        queryKey : ["messages/orgs"],
        queryFn : async () => await getOrgsMEssage()
    })
    const queryClient = useQueryClient()
    const {joinRoom} = useSocket()
    const router = useRouter()
    const dispatch : AppDispatch = useDispatch()
    const RoomJoin = async (roomName: string) => {
        const res = await joinRoom(roomName);
        console.log(`join Room Response ${res} `);
        return res;
      };
    if (isLoading) {
        return <div>orgs loading</div>
    }
    const click = async(org :orgs ) =>{
    const res =  await RoomJoin(org.socketRoomName)
       if (res) {
        dispatch(inOrg(org))
        await queryClient.invalidateQueries({queryKey : ["orgMessages"]})
        router.push(`/message/organizations/${org.id}`)
       }
    }
  return (
   
    <div>
         <MessagesNavbar />

       {
        orgs?.map((org)=>(
            <div className=' m-3  flex flex-row gap-4 cursor-pointer' onClick={()=> click(org)}>
           <Avatar src={org.avatar ? org.avatar : ""} />
                <h1>{org.name}</h1>
                 
            </div>
        ))
       }

    </div>
  )
}

export default page