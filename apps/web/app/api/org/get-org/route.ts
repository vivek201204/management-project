import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../../../../utility/ApiError";
import prisma from "../../../../constants/prisma";


export async function GET(req : NextRequest) {
    console.log("route ka andarr");
    
    const searchParams = req.nextUrl.searchParams
    const orgID = searchParams.get("orgID")

    if (!orgID) {
        throw new ApiError(400 , "cannot get orgID from searchParams")
    }
    console.log( "orgID",orgID);
    

    const org = await prisma.org.findFirst({
        where : {
            id : orgID
        } ,
        select : {
            id : true ,
            avatar : true ,
            employeeID : true ,
            bio : true ,
            coverImage : true, 
            email : true ,
            headline : true ,
            name : true ,
            posts : {
                take : 2,
                orderBy : {
                    createdAt : "desc"
                } ,
                select : {
                    comments : {
                        select : {
                            content : true ,
                             author : {
                                select : {
                                    avatar : true ,
                                    name : true ,
                                    
                                }
                             } ,
                             likes : {
                                select : {
                                    likedBy : {
                                        select : {
                                            avatar : true ,
                                            name : true
                                        }
                                    }
                                }
                             }
                        }
                    } ,
                    photo : true ,
                    impressions : true ,
                    isActive : true ,
                    likes : {
                        select : {
                            likedBy : {
                                select : {
                                    name : true ,
                                    avatar : true
                                }
                            }
                        }
                    } ,
                    videoFile : true ,
                    videoDuration : true ,
                    title : true ,
                    createdAt : true,
                    postOwner : {
                        select : {
                            avatar : true ,
                            name : true
                        }
                    },

                } ,

            } ,
            ownerID : true ,
            owner : {
                select :{
                    name : true ,
                    avatar : true ,
                    email : true
                }
            } ,
            story : {
                take : 2 ,
                orderBy : {
                    employeeID : "desc" ,
                    
                } ,
                where : {
                    isCompleted : false
                } ,
                select : {
                    employeeID : true ,
                    id : true , 
                    name : true ,
                    socketRoomName : true ,
                    manager : {
                        select : {
                            avatar : true ,
                            name : true
                        }
                    }
                }
            }
        }
    })

    if (!org) {
        throw new ApiError(404 , `cannot find org with this id ${orgID}`)
    }
console.log("org" , );

    return NextResponse.json({
        message : "org fetched successfully" ,
        org : org
    })

    
}