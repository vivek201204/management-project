import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../../../../utility/ApiError";
import prisma from "../../../../constants/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const friendID = searchParams.get("friendID");

  if (friendID === null) {
    throw new ApiError(404, "does not get friend ID");
  }

  const friend = await prisma.user.findFirst({
    where: {
      id: friendID,
    },
  });

  if (!friend) {
    throw new ApiError(404, "friend user not found");
  }

  const session = await getServerSession(authOptions);
  if (!session) {
    throw new ApiError(404, "User not found please login first");
  }
  const user = session.user;

  if (user.id === friend.id) {
    throw new ApiError(400, "user cannot make a frind itself");
  }

  const userFrindsProfile = await prisma.friendsList.findFirst({
    where: {
      userId: user.id,
    },
  });

  const check = userFrindsProfile?.friendsID;

  const IsAlreadyFrinnds = check?.includes(friend.id);

  if (IsAlreadyFrinnds) {
    const RemoveFriend = await prisma.friendsList.update({
      where: {
        userId: user.id,
      },
      data: {
        friends: {
          disconnect: {
            id: friend.id,
          },
        },
      },
    });

    return NextResponse.json({
      message: "friend Remove",
      output: RemoveFriend,
    });
  }

  const makeFriends = await prisma.friendsList.upsert({
    where: {
      userId: user.id,
    },
    update: {
      friends: {
        connect: {
          id: friend.id,
        },
      },
    },
    create: {
      user: {
        connect: {
          id: user.id,
        },
      },
      friends: {
        connect: {
          id: friend.id,
        },
      },
    },
  });

  return NextResponse.json({
    message: "frinds list message",
    newFriend: makeFriends,
  });
}
