"use client"
import React, { useEffect } from 'react'
import {useForm , SubmitHandler} from "react-hook-form"
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../store/store'
import { zodResolver } from "@hookform/resolvers/zod";
import { TupdateSchema, updateOrgSchema } from '../../../../constants/zodTypes'
import { Input } from '../../../../@/components/ui/input'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateOrg } from '../../../../constants/OrgQueryFN'

function UpdateOrg() {
    const {register , handleSubmit , setValue} = useForm<TupdateSchema>({
      resolver : zodResolver(updateOrgSchema)
    })
    const orgData = useSelector((state : RootState)=> state.org.org)
    
    if (!orgData) {
      return <div>Something Went Wrong</div>
    }

    useEffect(()=>{
     setValue('name' , orgData?.name)
     setValue('email' , orgData?.email)
     setValue('bio' , orgData?.bio ? orgData.bio : "")
     setValue('headline' , orgData.headline ? orgData.headline : "")
    } , [orgData , setValue])

    const {mutate : update , data , isPending} = useMutation({
      mutationFn : async (data : TupdateSchema) => await updateOrg(data , orgData.id) ,
      
    })
  
    const updateHandler : SubmitHandler<TupdateSchema> = (comingData ) =>{
      console.log("click hua");
      
     update(comingData)
    }

  return (
    <form onClick={handleSubmit(updateHandler)} className=' h-screen'>
        <div className=" flex flex-col gap-4 border border-black mr-10 h-4/5 ">
        
        <input className="w-64 h-10" type="text" placeholder='name'  {...register('name')} />
        <input type="text" placeholder='email' {...register("email")}/>
        <textarea  placeholder='bio' {...register("bio")}/>
        <input  type="text" placeholder='headline'  {...register("headline")}  />
        <button>update</button>
        </div>

    </form>
  )
}

export default UpdateOrg