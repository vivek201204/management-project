"use client"
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getPost } from '../../../constants/PostQueryFN'
import { Avatar ,AvatarFallback , AvatarImage } from '../../../@/components/ui/avatar'

interface parmas {
  postID  : string
}

function page({params} : {params : parmas}) {
  const {data : post , isLoading} = useQuery({
    queryKey : ["post"] ,
    queryFn : async() => await getPost(params.postID)
  })
  if (isLoading) {
    return <div>Post Loading</div>
  }
  if (!post) {
    return <div> Something went wrong</div>
  }
  return (

    <main className=' flex flex-row h-96 w-11/12 '>
      <div className=' h-auto w-1/2 flex  flex-col gap-3 '>
      <div className=' h-10 w-full   flex flex-row gap-10 items-center '>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png"></AvatarImage>
            <AvatarFallback>V</AvatarFallback>
           </Avatar>

           <h1>{post.postOwner.name}</h1>
      </div>
      <div className='  h-3/4 w-full'>
        <img className=' h-full w-full' src={post.photo ? post.photo : ""} alt="" />
      </div>

      <div className=' h-10 w-2/5   '>
        <h1 className=' ml-3'>likes</h1>
       
      </div>
    </div>
     <div className='  h-auto w-1/2 flex  flex-col gap-3 ml-10'>

     <div className=' h-10 w-full   flex flex-row  gap-28 items-center  '>
          <Avatar>
           
            <AvatarFallback>Icon</AvatarFallback>
           </Avatar>

           <h1>Comments</h1>
      </div>

      <div className =' border border-black  h-3/4 w-full'>
        comments
      </div>

     </div>
    </main>
  )
}

export default page