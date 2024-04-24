import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../../../../../utility/ApiError";
import prisma from "../../../../../constants/prisma";


export async function  GET(req : NextRequest) {
    const searchParams = req.nextUrl.searchParams

    const storyName = searchParams.get('storyName')

    if (!storyName) {
        throw new ApiError(400 , "cannot get storyName")
    }

    const story = await prisma.story.findFirst({
        where : {
            name : storyName
        } ,
        include : {
             employees : true ,
             manager : true ,
             org : true
        }
    })

    if (!story) {
        throw new ApiError(500 , "cannot get story")
    }

    return NextResponse.json({
        story : story
    })
}