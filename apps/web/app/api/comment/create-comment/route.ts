import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../../../../utility/ApiError";
import prisma from "../../../../constants/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";


export async function  POST(req : NextRequest) {

    
    const reqBody = await req.json()
    const {content} : {content : string}  = reqBody

    if (content.trim() === "") {
        throw new ApiError(400 , "content is empty string")
    }

    const searchParams = req.nextUrl.searchParams
    const postID = searchParams.get("postID")

    if (!postID) {
        throw new ApiError(400 , "cannot get postId with searchParams")
    }

    const post = await prisma.post.findFirst({
        where : {
            id : postID
        }
    })

    if (!post) {
        throw new ApiError(400 , "cannot find post with give id")
    }

    const session = await getServerSession(authOptions)
    if (!session) {
        throw new ApiError(400 , "User cannot make comment without login")
    }
    const user  = session.user

    // const userID = "65f034890a6e1bc1676affd5"

    const newComment = await prisma.comment.create({
        data : {
            content : content ,
            post : {
                connect : {
                    id : post.id
                }
            } ,
            author : {
                connect : {
                    id : user.id
                }
            } ,
            
        } ,
        include : {
            likes : true ,
            author : true ,
            post : true
        }
    })

    const createdComment = await prisma.comment.findFirst({
        where : {
            id : newComment.id
        }
    })

    if (!createdComment) {
        throw new ApiError(500 , "error while making comment")
    }

    return NextResponse.json({
        message : "comment make successfully" ,
        comment : newComment
    })


}