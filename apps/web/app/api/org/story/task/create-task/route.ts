import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../../../../../../utility/ApiError";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/[...nextauth]/route";
import prisma from "../../../../../../constants/prisma";

interface reqBody {
    content : string
    title : string
}

export async function POST(req:NextRequest) {
    const reqBody = await req.json()
    const {content , title} : reqBody = reqBody

    if ([content , title].some((item)=> item.trim() === "")) {
        throw new ApiError(400 , "please provide full information")
    }

    const session = await getServerSession(authOptions)
    if (!session) {
        throw new ApiError(404 , "user not found please login with us ")
    }
    const taskAssigner = session.user
     
    const searchParams = req.nextUrl.searchParams
   
    const reciverID = searchParams.get("reciverID")
    
    if (reciverID === null) {
        throw new ApiError(400 , "Cannot get reciever Id ")
    }

    const reciver = await prisma.user.findFirst({
        where : {
            id : reciverID 
        }
    })
   

    if (!reciver) {
        throw new ApiError(404 , "cannot find task reciver")
    }
    
    const storyID = searchParams.get("storyID")

    if (storyID === null) {
        throw new ApiError(400 , "Cannot get StoryID")
    }

    const story = await prisma.story.findFirst({
        where : {
            id : storyID
        }
    })

    if (!story) {
        throw new ApiError(400 , "cannot find story")
    }
    

    if (taskAssigner.id !== story.managerId) {
        throw new ApiError(400 , "you cannot give a task to anyone only manager can give a task")
    }

    const newTask = await prisma.task.create({
        data : {
            title : title ,
            content : content ,
            sender : {
                connect : {id  : taskAssigner.id}
            },
            reciver : {
                connect  : {
                    id : reciver.id
                }
            } ,
            story : {
                connect : {
                    id : story.id
                }
            }
        } ,
        include : {
            sender : true ,
            story : true ,
            reciver : true
        }
    })


    const createdTask = await prisma.task.findFirst({
        where :{
            id : newTask.id
        }
    })

    if (!createdTask) {
        throw new ApiError(500 , "error while creating a task")
    }

    const socketRoomName = `${createdTask.id}_reciver_${reciver.id}`
  
    const InsertSocketRoomName  = await prisma.task.update({
        where : {
            id : createdTask.id
        } ,
        data : {
            TaskSocketRoomName : socketRoomName
        }
    })  

    

    return NextResponse.json({
        message : "task created Successfully",
        task : InsertSocketRoomName
    })

}