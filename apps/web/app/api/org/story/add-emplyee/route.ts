import { NextRequest, NextResponse } from "next/server";

import prisma from "../../../../../constants/prisma";
import { Story, User } from "@prisma/client";
import { ApiError } from "../../../../../utility/ApiError";
import { io } from "socket.io-client";

interface AcknowledgementResponse {
    status: boolean;
  
  }

export async function POST(req: NextRequest) {
    
    const reqBody = await req.json()
    const { employeeID } : {employeeID : string} = reqBody
    const employee  = await prisma.user.findFirst({
        where: {
            id: employeeID
        },
        select: {
            name: true,
            id: true,
            email: true
        }
    })

    if (!employee) {
        throw new ApiError(404, "Employee not found")

    }
    console.log(employee);

    // const cookieStore = cookies();

    // const cookieValue = cookieStore.get("roomName");

    const storyRoomName = "65f034890a6e1bc1676affd5_search karo" // req.query




    const dbStory = await prisma.story.findFirst({
        where: {
            socketRoomName: storyRoomName
        },
        select: {
            id: true ,
            socketRoomName : true
        }
    })
    console.log("db story", dbStory);


    if (!dbStory) {
        console.log("db story nahi mili");

        throw new ApiError(404, "story not found")

    }

    const socket = io("http://localhost:3002")

 const res : AcknowledgementResponse = await socket.emitWithAck("joinRoom" , storyRoomName)

 if (res.status === false) {
    throw new ApiError(500 , "Cannot connect with Room ")
 }

    const addEmployee: Story = await prisma.story.update({
        where: {
            id: dbStory.id
        },
        data: {
            // emplyeeID : {push : employeeID},
           employees : {
            connect : {
                id : employeeID
            }
           }




        },
        include: {
          employees : true ,
            manager: true
        }
    })
    console.log("add employee", addEmployee);





    return NextResponse.json({
        updated: "updated",
        cookieValue: storyRoomName,
        updatedStory: addEmployee
    });

}
