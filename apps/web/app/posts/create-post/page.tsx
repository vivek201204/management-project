"use client"
import axios from 'axios'
import React from 'react'
import { useForm , SubmitHandler} from 'react-hook-form'

function page() {
  const {register , handleSubmit} = useForm()
  const onSubmti =async (data : any) =>{
    console.log("clicked");
    
    console.log(data.image[0]);

    const formData = new FormData()
    formData.append("post" , data.image[0])

    const res = await axios.post("/api/post/create-post?orgID=65fba7ef90dfb092289923fd" , formData , {
      headers : {
        "Content-Type" : "multipart/form-data"
      }
    })

    console.log(res);
    
    
  }
  return (
    <form onSubmit={handleSubmit(onSubmti)}>
      <input type="file" {...register("image")} />
      <button>Submit</button>
    </form>
  )
}

export default page