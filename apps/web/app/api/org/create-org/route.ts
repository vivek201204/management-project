import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { ApiError } from "../../../../utility/ApiError";
import { getServerSession } from "next-auth";
import prisma from "../../../../constants/prisma";
import { UploadApiResponse } from "cloudinary";
import { TakeAndUpload } from "../../../TakeImageAndUplad";

interface reqBody {
  name: string;
  code: string;
  headline: string;
  bio: string;
  email: string;
}

export async function POST(req: NextRequest) {
  const reqBody = await req.json();
  const { name,  email }: reqBody = reqBody;

  if ([name, email].some((field) => field.trim() === "")) {
    throw new ApiError(411, " Please Provide full required information");
  }

  const session = await getServerSession(authOptions);
  if (!session) {
    throw new ApiError(404, "User Session not found ! Firstly Login a User");
  }
  const user = session.user;
  const dbOrglName = `${user.id}_${name}`;

  const verfiyOrgName = await prisma.org.findFirst({
    where: {
      dbOrgName: dbOrglName,
    },
  });

  if (verfiyOrgName) {
    throw new ApiError(400, "User already make a org with this name");
  }

  let socketRoomName = `${user.id}_${name}`;

  // const filesData = await req.formData()

  // const avatarPhoto : File | null = filesData.get("avatar") as unknown as File

  // let avatar : UploadApiResponse | null = null

  // if (avatarPhoto) {
  //   avatar = await TakeAndUpload(avatarPhoto)
  // }

  

  const newOrg = await prisma.org.create({
    data: {
      name: name,
      email: email,
      dbOrgName: dbOrglName,
      socketRoomName: socketRoomName,
      owner: {
        connect: { id: user.id },
      },
    },
    include: {
      owner: true,
    },
  });

  const createdOrg = await prisma.org.findFirst({
    where: {
      id: newOrg.id,
    },
  });

  if (!createdOrg) {
    console.log("org nahi bani");

    throw new ApiError(500, "story not created");
  }
  return NextResponse.json({
    message: "org created Successfully",
    org: newOrg,
  });
}
