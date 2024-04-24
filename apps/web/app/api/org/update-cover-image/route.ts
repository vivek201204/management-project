import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../../../../utility/ApiError";
import prisma from "../../../../constants/prisma";
import { TakeAndUpload } from "../../../TakeImageAndUplad";

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
    const coverIamgePhoto : File | null = filesData.get("coverImage") as unknown as File

  if (coverIamgePhoto === null) {
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

  
  const  coverImage = await TakeAndUpload(coverIamgePhoto)
  if (!coverImage) {
    throw new ApiError(500 , "error while uploading image")
  }

  const updatedOrg = await prisma.org.update({
    where : {
        id : org.id 
    } ,
    data : {
        coverImage : coverImage.url
    } ,
    select : {
      id : true ,
      coverImage : true
    }
  })

  return NextResponse.json({
    message  : "org updated successfully" ,
    org     : updatedOrg ,
    success : true
  })
  
}