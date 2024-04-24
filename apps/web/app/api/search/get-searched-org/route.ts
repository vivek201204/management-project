import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../../../../utility/ApiError";
import prisma from "../../../../constants/prisma";


export async function GET (req : NextRequest) {
  const searchedParams =  req.nextUrl.searchParams
  const query = searchedParams.get("query")

  if (!query) {
    throw new ApiError(400 , "cannot get query")
  }

  const searchedorgs = await prisma.org.findMany({
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
            } ,
             
        ]
    } ,
    select  : {
        avatar : true ,
        id : true ,
        name : true ,
        email : true

    }
  })

  if (!searchedorgs) {
    return NextResponse.json({
        status : false ,
        orgs : null ,
        message : "cant find searched orgs"
    })
  }else{
    return NextResponse.json({
        status : true ,
        orgs : searchedorgs ,
        message : "searched orgs fetched"
    })
  }
}