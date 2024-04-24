import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../constants/prisma";
import { ApiError } from "../../../../utility/ApiError";

interface reqBody {
    query : string
}

export  async function GET (req : NextRequest){
    const searchParams = req.nextUrl.searchParams
    const query = searchParams.get("query")
    if (!query) {
        throw new ApiError(400 , "cannot get query")
    }
    const searchedusers  = await prisma.user.findMany({
        where : {
           OR : [
            {
                email : {
                    contains : query
                }
            } ,
            {
                name : {
                    contains : query
                }
            }
           ]
        } ,
        select : {
            avatar : true ,
            email : true ,
            id : true ,
            name : true
        }
    })
    if (!searchedusers) {
        return NextResponse.json({
            status : false ,
            message : "can't find the user with query" ,
            users : null
        })
    }else{
        return NextResponse.json({
            status : true ,
            users : searchedusers ,
            message : "searched users"
        })
    }
}