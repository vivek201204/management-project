"use client"
import React, { useState } from 'react'
import { postType } from '../api/post/get-posts/route'
import { Avatar  ,AvatarImage , AvatarFallback } from '../../@/components/ui/avatar'
import { AiOutlineLike } from "react-icons/ai";
import { useSession } from 'next-auth/react';
import { likes } from '../api/post/get-posts/route';
import { AiFillLike } from "react-icons/ai";
import axios from 'axios';
import {useRouter} from "next/navigation"
import { useQueryClient } from '@tanstack/react-query'


interface ReturnType {
    message : string ,
    isLiked : boolean
}


function Post({post} : {post : postType}) {

    // const {data} = useSession()
    // const userId = data?.user.id 

    const [isLiked , setIsLiked] = useState(false)
    const [likesLength , setLikesLength] = useState(post.likes.length)
    const router = useRouter()
    const queryClient = useQueryClient()

    // const findLikesLength = () => {
    //     return post.likes.length
    // }

    // const checkISLiked = (likes : Array<likes>) => {
    //    likes.map((like)=>{
    //      if (like.likedByID === userId) {
    //         setIsLiked(true)
    //      }
    //    })
    // } 
    
    // checkISLiked(post.likes)

    const makeLike = async() => {
        const {data} : {data : ReturnType} = await axios.post(`/api/like/toggle-post-like?postID=${post.id}`)
        console.log(data);
        
        if (data.isLiked === true) {
            setIsLiked(true)
           const length = post.likes.length
            setLikesLength(length)
        }else{
            setIsLiked(false)
             const length = post.likes.length
            setLikesLength(length)
        }
    }

    const visitPost = async (postId : string) =>{
        await queryClient.invalidateQueries({queryKey : ["post"]})
        router.push(`/posts/${postId}`)
    }

  return (
    <div onClick={()=> visitPost(post.id)} className=' border border-blue-100 cursor-pointer  h-72'>
        <div className=' ml-4 h-1/5 flex flex-row gap-10 items-center'>
           <Avatar>
            <AvatarImage src="https://github.com/shadcn.png"></AvatarImage>
            <AvatarFallback>V</AvatarFallback>
           </Avatar>
            <p className=' text-lg'>{post.postOwner.name}</p>
        </div>
        <div className=' h-2/3  w-full '>
            <img src={post.photo ? post.photo : ""} alt="" className=' w-full h-full' />
        </div>
        <div className= ' mt-2  ml-4 flex flex-row justify-between  '>
           <button onClick={makeLike}  className=' flex flex-row' > { <AiOutlineLike></AiOutlineLike>} {likesLength} </button>
           <button className=' mr-32'>comments</button>
          </div>
    </div>
  )
}
 
export default Post