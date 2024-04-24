import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../../../../utility/ApiError";
import prisma from "../../../../constants/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";


export async function POST(req : NextRequest) {
    const searchParams  = req.nextUrl.searchParams
    const commentID =  searchParams.get("commentID")

    if (!commentID) {
        throw new ApiError(400 , "cannot get commentId with searchParams")
    }

    const comment = await prisma.comment.findFirst({
        where : {
            id : commentID
        }
    })

    if (!comment) {
        throw new ApiError(404 , "cannot find comment with this given commentId")
    }

    const session = await getServerSession(authOptions)

    if (!session) {
        throw new ApiError(400 , "user cannot like without login")
    }

    const user = session.user

    const isAlreadyLike = await prisma.like.findFirst({
        where : {
            commentID : comment.id ,
            likedByID : user.id
        }
    })

    if (isAlreadyLike) {
        await prisma.like.delete({
            where : {
                id : isAlreadyLike.id
            }
        })

        return NextResponse.json({
            message : "unlike successfully" ,
            isLiked : false
        })
    }
    else {
        await prisma.like.create({
            data : {
                comment : {
                    connect : {
                        id : comment.id
                    }
                } ,
                likedBy : {
                    connect : {
                        id : user.id
                    }
                }
            }
        })

        return NextResponse.json({
            message : "like successfully" ,
            isLiked : true
        })
    }
}