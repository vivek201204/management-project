import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../../../../utility/ApiError";
import prisma from "../../../../constants/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";


export async function POST(req : NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const commentID = searchParams.get("commentID")

    if (!commentID ) {
        throw new ApiError(400 , "connot get commentID by searchParams")
    }

    const comment = await prisma.comment.findFirst({
        where : {
            id : commentID
        }
    })

    if (!comment) {
        throw new ApiError(400 , "can't find comment by commentID")
    }

    const session = await getServerSession(authOptions)
    if (!session) {
        throw new ApiError(400 , "User cannot delete comment without login")
    }
    const user = session.user

    if (comment.authorId !== user.id) {
        throw new ApiError(400 , "you have no access to delete comment")
    }

    await prisma.comment.delete({
        where : {
            id : comment.id
        }
    })

    return NextResponse.json({
        message : "comment deleted successfully"
    })

}