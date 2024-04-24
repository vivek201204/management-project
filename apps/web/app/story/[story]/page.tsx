"use client"
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../../store/store'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { getStory } from '../../../constants/StoryQueryFN'
import { Story, User } from '@prisma/client'
import { ReduxRootState } from '../../../store/ReduxStore/reduxStore'
import { newEmployee } from '../../../store/task/taskSlice'
import { useRouter } from 'next/navigation'
import { useSocket } from '../../custom-Hooks/SocketProvider'
import { getTasks } from '../../../constants/StoryQueryFN'
function page() {
    const story = useSelector((state : RootState)=> state.story.story)
    if (!story) {
      return
    }
  
    const org = useSelector((state : RootState)=> state.org.org)
    const router = useRouter()
    const dispatch : AppDispatch = useDispatch()

    const {data : FetchStory , isLoading} = useQuery({
      queryKey : ["story"] ,
      queryFn : async () => await getStory(story.id) ,
      staleTime : 10000
    })

    // const {} = useQuery({
    //   queryKey : ["tasks"] ,
    //   queryFn : async () => getTasks(story.id)
    // })

    if (isLoading) {
      return <h1>Loading</h1>
    }

    const task = (employee : User) =>{
       dispatch(newEmployee(employee))
       router.push("/task")
    }

    const chat = () =>{
      router.push(`/story/chat/${story.id}`)
    }
    
    console.log("fetched" , FetchStory);
    
  return (
    <>
    <h1>
        {story?.name}
    </h1>

    <button onClick={chat}>chat in Story</button>
    <h2>story Org Name {org?.email}</h2>
   <Link href="/story/create-story">Create Story</Link>

   <Link href="/story/add-employee" >Add Employee</Link>

   <div>
    <h1>Story Employees</h1>

    {FetchStory.employees.map((item : User)=>(
      <div className=' h-96 w-96 border border-blue-700'>
        <h1>Name === {item.name}</h1>
        <p>email = {item.email}</p>
        <button onClick={()=> task(item)}>Give Task</button> 
      </div>
    ))}
   </div>

    </>
  )
}

export default page