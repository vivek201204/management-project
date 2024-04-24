import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../../../../utility/ApiError";
import prisma from "../../../../constants/prisma";


export async function GET(req : NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const postID = searchParams.get("postID")

    if (!postID) {
        throw new ApiError(400 , "cannot get postID from searchParams")
    }

    const post = await prisma.post.findFirst({
        where : {
            id : postID
        } ,
        // include : {
        //     likes : true ,
        //     postOrg : true ,
        //     comments : true ,
        //     postOwner : true
        // }
        select : {
          comments : {
            select : {
                author : {
                    select : {
                        avatar : true ,
                        name : true ,

                    }
                } ,
                id : true ,
                content : true ,
                likes : {
                    select : {
                         likedBy : {
                             select : {
                                name : true ,
                                avatar : true
                             }
                         } ,
                         likedByID : true
                    }
                } ,

            }
          }   ,
          title : true ,
          impressions : true ,
          createdAt : true ,
          videoDuration : true ,
          videoFile : true ,
          postOwner : {
            select : {
                avatar : true ,
                name : true ,
               

            }
          } ,
          likes : {
            select : {
                likedByID : true ,
                likedBy : {
                    select : {
                        name : true ,
                        avatar : true
                    }
                }
            }
          } ,
           photo : true ,

        }
    })

    if (!post) {
        throw new ApiError(404  , "cannot find post with this id")
    }

    return NextResponse.json({
        message : "post fetched successfully" ,
        post  : post
    })
}