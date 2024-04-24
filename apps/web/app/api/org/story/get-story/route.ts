import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../../../../../utility/ApiError";
import prisma from "../../../../../constants/prisma";




export async function GET(req : NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const storyId = searchParams.get("storyID")

    if (storyId === null) {
        throw new ApiError(400 , "cannot get storyId by searchParams")
    }

    const story = await prisma.story.findFirst({
        where: {
            id : storyId ,
            
        },
        include : {
            employees : true
        }
    })

    if (!story) {
        throw new ApiError(400 , "Story Not found")
    }

    return NextResponse.json({
        message : "story fetched successfully" ,
        story : story
    })
}
