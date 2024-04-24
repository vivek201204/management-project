import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "../../../../constants/prisma";
import { Org, User } from "@prisma/client";
import { ApiError } from "../../../../utility/ApiError";

export interface postType {
  
  impressions: number;
  createdAt: Date;
  likes: Array<likes>;
  title: string | null;
  photo: string | null;
  videoFile: string | null;
  videoDuration: string | null;
  postOwner: user;
  id: string;
}
export interface Comments {
  author: user;
  content: string;
  likes: Array<likes>;
}
interface user {
  name: string;
  avatar: string | null;

}
export interface likes {
  likedBy: user;
  likedByID : string
}

const fetchFriendPost = async (friendID: string): Promise<Array<postType>> => {
  const posts = await prisma.post.findMany({
    where: {
      postOwnerID: friendID,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
     
      impressions: true,
      createdAt: true,
      likes: {
        select: {
          likedBy: {
            select: {
              name: true,
              avatar: true,
              
            },
          },
          likedByID : true
        },
      },
      title: true,
      photo: true,
      videoFile: true,
      videoDuration: true,
      postOwner: {
        select: {
          name: true,
          avatar: true,
          
        },
      },
      id: true,
    },
  });

  return posts;
};

const fetchOrgPost = async (orgID: string) => {
  console.log(orgID);

  const posts = await prisma.post.findMany({
    where: {
      postOrgID: orgID,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      
      impressions: true,
      createdAt: true,
      likes: {
        select: {
          likedBy: {
            select: {
              name: true,
              avatar: true,
              
            },
          },
          likedByID : true
        },
      },
      title: true,
      photo: true,
      videoFile: true,
      videoDuration: true,
      postOwner: {
        select: {
          name: true,
          avatar: true,
          
        },
      },
      id: true,
    },
  });

  return posts;
};
const fetchOrgPosts = async (
  orgs: Array<Org>,
  index: number,
  posts: Array<postType>
): Promise<Array<postType> | null> => {
  if (!orgs) {
    return null;
  }

  if (index >= orgs.length) {
    return posts;
  }

  const currentOrg = orgs[index];

  if (currentOrg && currentOrg.id) {
    const orgposts = await fetchOrgPost(currentOrg.id);

    posts = [...posts, ...orgposts];
  }

  // Call the function recursively with index incremented
  return fetchOrgPosts(orgs, index + 1, posts);
};

const fn = async (
  friends: Array<User>,
  index: number,
  posts: Array<postType>
): Promise<Array<postType> | null> => {
  if (!friends) {
    return null;
  }

  if (index >= friends.length) {
    console.log(posts);
    return posts;
  }

  const currentFriend = friends[index];

  if (currentFriend && currentFriend.id) {
    const friendPost = await fetchFriendPost(currentFriend.id);

    posts = [...posts, ...friendPost];
  }

  // Call the function recursively with index incremented
  return fn(friends, index + 1, posts);
};

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  
  if (!session) {
    // if user are not login then we send our app most famous posts
    const posts = await prisma.post.findMany({
      orderBy: {
        impressions: "desc",
      },
      select: {
        comments: {
          select: {
            author: {
              select: {
                name: true,
                avatar: true,
                id : true
              },
            },
            content: true,
            likes: {
              select: {
                likedBy: {
                  select: {
                    name: true,
                    avatar: true,
                    id : true
                  },
                },
              },
            },
          },
        },
        impressions: true,
        createdAt: true,
        likes: {
          select: {
            likedBy: {
              select: {
                name: true,
                avatar: true,
                id : true
              },
            },
          },
        },
        title: true,
        photo: true,
        videoFile: true,
        videoDuration: true,
        postOwner: {
          select: {
            name: true,
            avatar: true,
            id : true
          },
        },
        id: true,
      },
    });
    return NextResponse.json({
      message: "posts without login fetched",
      posts: posts,
    });
  }


  const user = session.user;
  const userFriendsProfile = await prisma.friendsList.findFirst({
    where: {
      userId: user.id,
    },
    include: {
      friends: true,
    },
  });

  const friends = userFriendsProfile?.friends;

  if (!friends) {
    return;
  }
  let posts: Array<postType> = [];

  const returnedposts = await fn(friends, 0, posts);
  console.log(returnedposts);

  const userActiveOrgs = await prisma.org.findMany({
    where: {
      owner: {
        every: {
          id: user.id,
        },
      },
      employees: {
        every: {
          id: user.id,
        },
      },
    },
  });

  const orgPosts = await fetchOrgPosts(userActiveOrgs, 0, posts);

  const allPosts = [...(returnedposts ?? []), ...(orgPosts ?? [])];

  return NextResponse.json({
    message: " post fetches",
    posts: allPosts,
  });
}
