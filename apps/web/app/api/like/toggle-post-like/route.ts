import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../../../../utility/ApiError";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "../../../../constants/prisma";


export async function POST(req : NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const postID =  searchParams.get("postID")

    if (!postID) {
        throw new ApiError(400 , "Cannot get postId from searchParams")
    }

    const post = await prisma.post.findFirst({
        where :{
            id : postID
        }
    })
    
    if (!post) {
        throw new ApiError(400 , "cannot find post with given id")
    }

    const session = await getServerSession(authOptions)
    
    if (!session) {
        throw new ApiError(400 , "user cannot like without login")
    }

    const user = session.user

    // const userID = "65f034890a6e1bc1676affd5"

    // see if user already like the post
    
    const isAlreadyLike = await prisma.like.findFirst({
        where : {
            postID : post.id ,
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
                post : {
                    connect :{
                        id : post.id
                    }
                } ,
                likedBy : {
                    connect :{
                        id : user.id
                    }
                }
            }
        })

        return NextResponse.json({
            message : "liked successfully" ,
            isLiked : true
        })
    }

}