import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { ApiError } from "../../../../utility/ApiError";
import prisma from "../../../../constants/prisma";


interface reqBody {
  content: string;
}
export async function POST(req: NextRequest) {
  const reqBody = await req.json();
  const { content }: reqBody = reqBody;

  const session = await getServerSession(authOptions);
  if (!session) {
    throw new ApiError(400, "session not found");
  }
  const user = session.user;
  const userCheck = await prisma.user.findFirst({
    where: {
      id: user.id,
    },
  });
  if (!userCheck) {
    throw new ApiError(400, "user not found");
  }

  const searchParams = req.nextUrl.searchParams;
  const GroupName = searchParams.get("GroupName");

  if (!GroupName) {
    throw new ApiError(400, "groupname is null");
  }

  const createMessage = await prisma.message.create({
    data: {
      content: content,
      sender: {
        connect: {
          id: user.id,
        },
      },
      GroupName: GroupName,
    },
    select : {
      content : true ,
      likes : {
        select : {
          likedByID : true ,
          likedBy : {
            select : {
              avatar : true ,
              name : true
            }
          }
        }
      } ,
      sender : {
        select : {
          avatar : true  ,
          name : true
        }
      } ,
      createdAt : true ,
      id : true
    }
  });

  const createdMessage = await prisma.message.findFirst({
    where : {
        id : createMessage.id
    } 
  })

  if (!createdMessage) {
    throw new ApiError(500 , "error while creating message")
  }
  return NextResponse.json({
    message : "created successfully" ,
    createdMessage : createMessage
  })
}
