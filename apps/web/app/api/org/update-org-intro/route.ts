import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../../../../utility/ApiError";
import prisma from "../../../../constants/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

interface IreqBody {
  name: string;
  email: string;
  headline: string;
  bio: string;
}

export async function POST(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const orgID = searchParams.get("orgID");

  if (!orgID) {
    throw new ApiError(400, "cannot get OrgId from searchParams");
  }

  const org = await prisma.org.findFirst({
    where: {
      id: orgID,
    },
  });
  if (!org) {
    throw new ApiError(400, "cannot find org by given id");
  }

  const session = await getServerSession(authOptions);
  if (!session) {
    throw new ApiError(
      400,
      "User cannot update anything without Login into app"
    );
  }
  const user = session.user;

  const orgOwners = org.ownerID;
  const verfiyUserToUpdate = orgOwners.includes(user.id);

  if (!verfiyUserToUpdate) {
    throw new ApiError(400, "You have no access to update this org");
  }
  const reqBody = await req.json();
  const { name, bio , email, headline }: IreqBody = reqBody;
 let socketRoomName : string = ""  ;
 let dbOrgName : string  = "";
  if (name) {
    socketRoomName = `${user.id}_${name}`
    dbOrgName  = `${user.id}_${name}`
  }
  const updateOrg = await prisma.org.update({
    where : {
        id: org.id
    } ,
    data : {
        headline : headline ? headline : org.headline,
        bio    : bio ? bio : org.bio ,
        name  : name ? name : org.name ,
        email  : email ? email : org.email ,
        dbOrgName : name ? dbOrgName : org.dbOrgName ,
        socketRoomName : name ? socketRoomName : org.socketRoomName
    }
  })
  return NextResponse.json({
    message : "org intro updated",
    updateOrg : updateOrg ,
    success : true
  })
}
