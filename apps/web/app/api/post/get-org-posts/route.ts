import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../../../../utility/ApiError";
import prisma from "../../../../constants/prisma";


export async function GET(req : NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const orgID = searchParams.get("orgID")

    if (!orgID) {
        throw new ApiError(400 , "cannot get orgID by searchParams")
    }

    const org = await prisma.org.findFirst({
        where : {
            id : orgID
        }
    })

    if (!org) {
        throw new ApiError(400 , "cannot find org by givenID")
    }

    const posts = await prisma.post.findMany({
        where : {
            postOrgID : org.id
        } ,
        orderBy : {
            createdAt : "desc"
        } ,
        include : {
            comments : true ,
            likes : true ,
            
        }
    })

    if (!posts) {
        return NextResponse.json({
            message : "org does not have any posts right now" ,
            isPosts : false
        })
    }
    return NextResponse.json({
        message : "Orgs Posts fetched successfully" ,
        isPosts : true ,
        posts : posts
    })


}