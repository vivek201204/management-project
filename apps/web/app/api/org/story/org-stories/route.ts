
import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../../../../../utility/ApiError";
import prisma from "../../../../../constants/prisma";

export async function GET(req : NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const orgID = searchParams.get("orgId")

    console.log("search params" ,orgID);

    if (!orgID) {
        throw new ApiError(400 , "cannot get orgId by params ")
    }

   const stories = await prisma.story.findMany({
    where : {
        org : {
            every : {
                id : `${orgID}`
            }
        }
    }
   })


if (!stories) {
    return NextResponse.json({
        message : "no stories"
    })
}
console.log( "stories",stories);



    return NextResponse.json({
        message : "Stories fetched" ,
        stories : stories
    })
    

}