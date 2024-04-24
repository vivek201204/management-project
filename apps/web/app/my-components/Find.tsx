"use server"
import prisma from "../../constants/prisma"
export const find = async(name : string) =>{
    
   const user = await prisma.user.findFirst({
    where : {
      name : name
    }
   })
   return user
  }