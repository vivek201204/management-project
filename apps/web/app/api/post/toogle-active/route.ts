import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../../../../utility/ApiError";
import prisma from "../../../../constants/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const postID = searchParams.get("postID");

  if (!postID) {
    throw new ApiError(400, "cannot get postId by searchParams");
  }
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new ApiError(400, "User cannot update post without login");
  }
  const user = session.user;

  const post = await prisma.post.findFirst({
    where: {
      id: postID,
    },
  });

  if (!post) {
    throw new ApiError(400, "cannot find post with this given id");
  }

  if (post.postOwnerID !== user.id) {
    throw new ApiError(400, "You have no access to update this post");
  }

  if (post.isActive === true) {
    const updatedPost = await prisma.post.update({
      where: {
        id: post.id,
      },
      data: {
        isActive: false,
      },
    });
    return NextResponse.json({
      message: "post status active updated successfully",
      updatedPost: updatedPost,
    });
  } else {
    const updatedPost = await prisma.post.update({
      where: {
        id: post.id,
      },
      data: {
        isActive: true,
      },
    });

    return NextResponse.json({
      message: "post status updated successfully",
      updatedPost: updatedPost,
    });
  }
}
