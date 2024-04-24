"use client"
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import React from 'react'
import { getNotifications } from '../../constants/Notifications'

function page() {
    
    const {data , isLoading} = useQuery({
        queryKey : ["notifications"] ,
        queryFn : async ()=> await getNotifications()
    })
    if (isLoading) {
        return <div>Notifications Loading</div>
    }
    if (!data) {
        return <div>error while fetching notifications</div>
    }
    console.log(data);
    
  return (
    <div>
        {data.status ? 
          data.notifications.map((notification)=>(
            <h1>{notification.content}</h1>
          ))
        : <div>There is not any notifications</div> }
    </div>
  )
}

export default page