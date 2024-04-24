"use client"
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { searchOrgs, searchUser } from '../../constants/SearchQueryFn'
import { Avatar } from '@mui/material'
import {  RootState } from '../../store/store'
import {  useSelector } from 'react-redux'

interface params {
    query : string
}
function UserQueryPage() {
   const query = useSelector((state : RootState)=> state.query.query)
   if (!query){
    return <div> Something went worng</div>
   }
    const {data , isLoading} = useQuery({
        queryKey : ["search/user"] ,
        queryFn : async () => await searchUser(query)
    })
 
    if (isLoading) {
      return <div>Search Query Loading</div>
    }
  return (
    <div>
      {data?.status ? 
        <div>
        {data.users.map((user)=>(
        <>
            <Avatar src={user.avatar ? user.avatar : ""}></Avatar>
            <h1>{user.name}</h1>
            </>
            
        ))}
       </div>
      : <div> Soory Cant find the user </div>}
    </div>
  )
}

export default UserQueryPage