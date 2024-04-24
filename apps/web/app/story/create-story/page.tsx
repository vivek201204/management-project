"use client"

import React from 'react'

import {useSelector} from 'react-redux';
import axios from 'axios';
import { ReduxRootState } from '../../../store/ReduxStore/reduxStore';

function page() {

 

 const org = useSelector((state : ReduxRootState)=>state.org.org)
  
  const create = async () =>{
   
    const res = await axios.post("/api/org/story/createStory" , {
      name : "search karro" ,
      orgId : org?.id
    } , )
    console.log(res);
    
  }

  return (<>
  {/* {<div className=' h-screen bg-slate-900 w-1/6 pt-5 border-solid border-orange-700 border-r-4'  >

   <div className=' h-12 w-full border-solid border-orange-700 border-b-4 flex justify-center flex-col items-center'>
      <button className=' text-white '>Pro-Perly</button>
   </div>

  <div className='pl-10 pt-5'> 
      <button className=" pl-5  text-white  hover:cursor-pointer ">Search</button>
    </div>
    <div className='pl-10 pt-5'> 
      <button className=" pl-5  text-white  hover:cursor-pointer ">Story</button>
    </div>
    <div className='pl-10 pt-5'> 
      <button className=" pl-5  text-white  hover:cursor-pointer ">Messgae</button>
    </div>
    <div className='pl-10 pt-5'> 
      <button className=" pl-5  text-white  hover:cursor-pointer ">VideoCall</button>
    </div>
    <div className='pl-10 pt-5'> 
      <button className=" pl-5  text-white  hover:cursor-pointer ">Profile</button>
    </div>
    <div className='pl-10 pt-5'> 
      <button className=" pl-5  text-white  hover:cursor-pointer ">Tasks</button>
    </div>
    
  </div> } */}
<button onClick={create}>createStory</button>
  </>
    
    
  )
}

export default page