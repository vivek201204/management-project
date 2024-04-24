"use client"
import { useForm } from "react-hook-form";
import React , {useState} from 'react'
import axios from 'axios'
import { find } from "../../my-components/Find";




function page() {
const {register , handleSubmit} = useForm()

const log =async (data : any) =>{
  console.log(data.name);
  const finduser =await find(data.name)
  console.log(finduser);

 const res = await axios.post("/api/org/story/add-emplyee" , {
  employeeID : finduser?.id
 })
 console.log(res);
 

 
 
  
}



  return (
    <>
    <form onSubmit={handleSubmit(log)}>
      <input className="" type="text" {...register("name")}  />
    <button> click</button>
    </form>
    </>
  )
}

export default page