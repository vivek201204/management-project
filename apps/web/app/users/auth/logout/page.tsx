"use client"

import { signOut } from "next-auth/react"
import {logout as authLogout} from "../../../../store/auth/authSlice"
import React from 'react'
import { useDispatch } from "react-redux"
import { useRouter } from "next/navigation"

function page() {
  const dispatch = useDispatch()
  const router = useRouter()
  const logout = () =>{
    signOut()
    dispatch(authLogout())
    router.push("/")
  }
  return (
    <button onClick={logout}>Logout</button>
  )
}

export default page