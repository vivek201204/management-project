"use client"
import React from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { getPosts } from '../../constants/PostQueryFN'
import Post from './Post'

function page() {

  const {data : posts , isLoading} = useQuery({
    queryKey : ["posts"] ,
    queryFn : async () => await getPosts()
  })

  if (isLoading) {
    return <div>Loading</div>
  }


  return (
    <>
    <div>
    <Link href="/posts/create-post">Create Post</Link>
    </div>

    <div className=' grid grid-cols-3 gap-8 mt-6 mr-4'>
      {posts?.map((post)=>(
       <Post  post={post}/>
      ))}
    </div>
    </>
  )
}

export default page