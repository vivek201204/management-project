import { NextRequest } from "next/server"
import { ApiError } from "../../../../utility/ApiError"
import { TakeAndUpload } from "../../../TakeImageAndUplad"
import prisma from "../../../../constants/prisma"
import { NextResponse } from "next/server"

export async function POST(req : NextRequest) {

    const searchParams = req.nextUrl.searchParams
     const orgID =   searchParams.get("orgID")

     if (!orgID) {
        throw new ApiError(400 , "cannot get orgId By searchparams")
     }

     const org = await prisma.org.findFirst({
        where : {
            id : orgID
        }
     })

     if (!org) {
        throw new ApiError(404 , "cannot find org by given Id")
     }

    const filesData = await req.formData()
    const avatarPhoto : File | null = filesData.get("avatar") as unknown as File

  if (avatarPhoto === null) {
     const updatedOrg = await prisma.org.update({
        where : {
            id : org.id
        } ,
        data :{
            coverImage : null
        }
     })

     return NextResponse.json({
        messsage : "org updated successfully" ,
        org  : updatedOrg
     })
  }

  
  const  avatar = await TakeAndUpload(avatarPhoto)
  if (!avatar) {
    throw new ApiError(500 , "error while uploading image")
  }

  const updatedOrg = await prisma.org.update({
    where : {
        id : org.id 
    } ,
    data : {
        avatar : avatar.url
    }
  })

  return NextResponse.json({
    message  : "org updated successfully" ,
    org     : updatedOrg
  })
  
}