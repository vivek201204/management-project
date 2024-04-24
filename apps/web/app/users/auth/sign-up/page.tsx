"use client"
import {zodResolver} from "@hookform/resolvers/zod"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useForm , SubmitHandler } from "react-hook-form"
import { TsignUpSchema, signUpSchema } from "../../../../constants/zodTypes"
import { signIn } from "next-auth/react"
import { User } from "@prisma/client"
import { useDispatch } from "react-redux"
import { login } from "../../../../store/auth/authSlice"


function SignupForm() {
  const{register,handleSubmit} =useForm<TsignUpSchema>({
    resolver : zodResolver(signUpSchema)
  })
  const router = useRouter()
  const dispatch = useDispatch()

     const signUP : SubmitHandler<TsignUpSchema> = async(data)=>{
       

       const {confirmPassword , ...withoutConfirmPass} = data

       const res = await axios.post("/api/register" , withoutConfirmPass)

       if (res) {
        const user : User = res.data.user
        const loginUser  = await signIn("credentials" , {
            redirect : false ,
            email : user.email ,
            password : withoutConfirmPass.password
        })

        if (!loginUser?.ok) {
            console.log("something went wrong");
            
            return
        }

        dispatch(login(user))

       }
       console.log(res);
       
       
       router.push("/")
       
     }

  return (
    <>
    <form onSubmit={handleSubmit(signUP)}>
        <input type="text" {...register("name")} placeholder="enter name" />
        <input type="text" {...register("email")} placeholder="enter email" />
        <input type="text" {...register("password")} placeholder="enter password" />
        <input type="text" {...register("confirmPassword")} placeholder="enter confirm Passoword" />
        <button>click</button>
    </form>
</>)
}

export default SignupForm