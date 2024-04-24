import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../../../../utility/ApiError";
import prisma from "../../../../constants/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";



export async function POST(req : NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const postID = searchParams.get("postID")

    if (!postID) {
        throw new ApiError(400 , "cannot get postId by searchParams")
    }

    const post  = await prisma.post.findFirst({
        where : {
            id : postID
        }
    })

    if (!post) {
        throw new ApiError(400 , "cannot find post by given postID")
    }

    const session = await getServerSession(authOptions)
    if (!session) {
        throw new ApiError(400 , "Please Login to delete the post")
    }
    const user = session.user

    if (post.postOwnerID !== user.id) {
        throw new ApiError(400 , "you have no access to delete this post")
    }

    await prisma.post.delete({
        where : {
            id : post.id
        }
    })

    return NextResponse.json({
        message : "post successfully deleted"
    })
}