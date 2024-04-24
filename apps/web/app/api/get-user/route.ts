import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../../../utility/ApiError";
import prisma from "../../../constants/prisma";



export async function GET(req : NextRequest) {
    const searchParams  = req.nextUrl.searchParams
    const userId = searchParams.get("userID")

    if (!userId) {
        throw new ApiError(400 , "cannot get userID , please provide userId")
    }

    const user = await prisma.user.findFirst({
        where : {
            id : userId
        }
    })

    if (!user) {
        throw new ApiError(404 , "user not found with this userId")
    }

    return NextResponse.json({
        message  : "user fetched successfully" ,
        user : user
    })

}