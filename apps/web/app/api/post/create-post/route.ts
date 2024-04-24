import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { ApiError } from "../../../../utility/ApiError";
import prisma from "../../../../constants/prisma";
import { writeFile } from "fs/promises";
import { uploadOnCloudinary } from "../../../../utility/cloudinary";
import { UploadApiResponse } from "cloudinary";
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
    const post : File | null = filesData.get("post") as unknown as File

//      if (coverIamgePhoto === null) {
//      const updatedOrg = await prisma.post.update({
//         where : {
            
//         } ,
//         data :{
//              : null
//         }
//      })

//      return NextResponse.json({
//         messsage : "org updated successfully" ,
//         org  : updatedOrg
//      })
//   }

if (post === null) {
    console.log("post null haia ");
    return
}

const session = await getServerSession(authOptions)
if (!session) {
    console.log("session nahi hai");
    
   return 
}
const user = session.user
  
  const  uploadedPost = await TakeAndUpload(post)
  if (!uploadedPost) {
    throw new ApiError(500 , "error while uploading image")
  }

  const createdpost = await prisma.post.create({
    data : {
        photo : uploadedPost.url,
        postOrg : {
            connect : {
                id : org.id
            }
        } ,
        postOwner : {
            connect : {
                id : user.id
            }
        }
    }
  })

  return NextResponse.json({
    message  : "post cretaed successfully" ,
    post   : createdpost ,
    
  })
  
}