import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { ApiError } from "../../../../utility/ApiError";
import prisma from "../../../../constants/prisma";

export async function GET(req : NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session) {
        throw new ApiError(400 , "user can't find")
    }
    const user = session.user

    const posts = await prisma.post.findMany({
        where : {
            postOwnerID : user.id
        } ,
        include : {
            likes : true ,
            comments : true ,
            postOwner : true ,
            postOrg : true
        }
    })

    if (!posts) {
        return NextResponse.json({
            message  : "user not yet upload any post"
        })
    }
    else {
        return NextResponse.json({
            message : "user post fetched successfully" ,
            posts : posts 
        })
    }
}