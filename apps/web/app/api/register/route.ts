import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../constants/prisma";
import bcrypt from "bcrypt";
import { ApiError } from "../../../utility/ApiError";
import { TakeAndUpload } from "../../TakeImageAndUplad";
import { UploadApiResponse } from "cloudinary";

interface user {
  name: string;
  password: string;
  email: string;
}

export async function POST(req: NextRequest) {
  const reqBody = await req.json();
  const { email, name }: user = reqBody;

  if ([email, reqBody.password, name].some((field) => field?.trim() === "")) {
    throw new ApiError(411, "please Provide us full User information");
  }

  const existedUser = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (existedUser) {
    throw new ApiError(400, "user with this email already exists");
  }
  const hashedPassword = await bcrypt.hash(reqBody.password, 10);

  const filesData = await req.formData();

  const avatarphoto: File | null = filesData.get("image") as unknown as File;

  let avatar: UploadApiResponse | null = null;

  if (avatarphoto) {
    avatar = await TakeAndUpload(avatarphoto);
  }

  let FormCoverImage: File | null = filesData.get(
    "coverImage"
  ) as unknown as File;

  let coverImage: UploadApiResponse | null = null;

  if (FormCoverImage) {
    coverImage = await TakeAndUpload(FormCoverImage);
  }

  const newUser = await prisma.user.create({
    data: {
      email: email,
      password: hashedPassword,
      name: name,
      avatar: avatar?.url,
      coverImage: coverImage?.url,
    },
  });

  const createdUser = await prisma.user.findFirst({
    where: {
      id: newUser.id,
    },
  });

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating a user ");
  }

  const { password, ...userwithoutPass } = createdUser;

  return NextResponse.json({
    message: "user created SuccessFully",
    user: userwithoutPass,
  });
}
