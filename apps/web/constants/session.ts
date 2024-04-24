"use client"
import { useSession } from "next-auth/react"

export  function session() {
    const {data : session}  = useSession()
    if (!session) {
        return
    }
    const user = session.user
    return user
}