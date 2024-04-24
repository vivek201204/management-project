import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth"
import { authOptions } from "../../../auth/[...nextauth]/route";
import { io } from "socket.io-client";
import prisma from "../../../../../constants/prisma";

import { ApiError } from "../../../../../utility/ApiError";

interface AcknowledgementResponse {
  status: boolean;

}

export async function POST(req: NextRequest) {

  const reqBody = await req.json()
  const { name  , orgId}: { name: string , orgId : string } = reqBody
  // const SearchParams = req.nextUrl.searchParams
  // const orgID = SearchParams.get("orgId")
  // console.log("orgID" ,orgID);
  // if (!orgID) {
  //   throw new ApiError(400, "cannot get orgId from route query parameters")
  // }
  
  
  const session = await getServerSession(authOptions)

  const user = session?.user

  if (!user) {
    throw new ApiError(401, "user not found with session id please login a user")
  }



  const storyRoomName = `${user.id}_${name}`
  // console.log(storyRoomName);

  const verifyStoryRoomName = await prisma.story.findFirst({
    where: {
      name: storyRoomName
    }
  })

  if (verifyStoryRoomName) {
    throw new ApiError(400, "User already make a story with this name")
  }

  const socket = io("http://localhost:3002");
  const response: AcknowledgementResponse = await socket.emitWithAck("joinRoom", storyRoomName)
  const status = response.status

  if (status === false) {
    throw new ApiError(500, "cannot connect with socket Room")
  }

  const newStory = await prisma.story.create({
    data :{
      name : name ,
      socketRoomName : storyRoomName ,
      manager : {
        connect : {
          id : user.id
        }
      } ,
     org : {
      connect : {
        id : orgId
      }
     } ,
     
    },
    include: {
      manager: true,
      org: true
    }
  })




  const createdStory = await prisma.story.findFirst({
    where: {
      socketRoomName: storyRoomName
    }
  })

  if (!createdStory) {
    throw new ApiError(500, "Something went wrong while making Story")
  }

  return NextResponse.json({
    story: newStory
  })

}