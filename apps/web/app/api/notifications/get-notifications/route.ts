import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../../../../utility/ApiError";
import prisma from "../../../../constants/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new ApiError(400, "session not found");
  }
  const user = session.user;
  const notifications = await prisma.notification.findMany({
    where: {
      recieverID: user.id,
    },
  });

  if (!notifications) {
    return NextResponse.json({
      message: "user doesnot have any notifications",
      notifications: null,
      status: false,
    });
  } else {
    return NextResponse.json({
      message: "user notification fetched",
      notifications: notifications,
      status: true,
    });
  }
}
