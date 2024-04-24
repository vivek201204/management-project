import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../../../../utility/ApiError";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "../../../../constants/prisma";


export async function GET(req : NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session) {
        throw new ApiError(404 , "user not login , Firstly login to get Friends Profile")
    }
   const user = session.user

 

   const frindsProfile = await prisma.friendsList.findFirst({
    where : {
        userId : user.id
    } ,include : {
        friends : true
    }
   })

  
   
   if (!frindsProfile) {
    throw new ApiError(404 , "user doesnot have frindsList Profile")
   }

   
   
   return NextResponse.json({
    message : "user friends list profile fetched" ,
    profile : frindsProfile
   })
}