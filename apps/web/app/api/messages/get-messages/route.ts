import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../../../../utility/ApiError";
import prisma from "../../../../constants/prisma";



export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const GroupName = searchParams.get("GroupName");

  if (!GroupName) {
    throw new ApiError(400, "Group Name Not found");
  }

  const Messages = await prisma.message.findMany({
    where: {
      GroupName: GroupName,
    },
    select : {
      content : true ,
     
      sender : {
        select : {
          avatar : true  ,
          name : true ,
          id : true
        }
      } ,
      
    }
  });

  if (!Messages) {
    return NextResponse.json({
      message: "Messages list is empty",
    });
  }
  return NextResponse.json({
    message: "messgae get sucesfully",
    messages: Messages,
  });
}
