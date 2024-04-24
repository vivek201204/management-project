import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "../../../../constants/prisma";
import { Org } from "@prisma/client";
import { client } from "../../../Rdeis";

import { ApiError } from "../../../../utility/ApiError";

interface IOrg {
  avatar : string | null ,
  name : string ,
  id : string ,
  headline : string | null ,
  socketRoomName : string ,
  employeeID : Array<string>

}

const setHashes = async (orgs: Array<IOrg>, username: string) => {
  orgs.map(async (data, index: number) => {
    const hashkey = `${username}-org:${index + 1}`;
    await client.hmset(hashkey, data, async (err, result) => {
      if (err) {
        console.log(`failed setting ${hashkey} ${err}`);
      } else {
        console.log(`successfully set ${hashkey} ${result}`);

        await client.expire(hashkey, 3600, (err, result) => {
          if (err) {
            console.log(
              `fail to set expire on ${hashkey} and the error is ${err} `
            );
          } else {
            console.log(`successfully sets expires on ${hashkey}`);
          }
        });
      }
    });
  });
};

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new ApiError(400, "user session not found");
  }
  const user = session.user;
  console.log(user.id);
  
  const orgs = await prisma.org.findMany({
    where: {
      owner: {
        every: {
          id: user.id
        },
      },
      employees : {
        every : {
          id : user.id
        }
      }
    },
    select : {
      avatar : true ,
      id : true ,
      name : true ,
      headline : true ,
      socketRoomName : true ,
      employeeID : true
      
    }
    
  });

  

  if (!orgs) {
    return NextResponse.json({
      message: "user not yet created Org",
    });
  } else {
    await setHashes(orgs, user.name);

    return NextResponse.json({
      message: "User Orgs fetched Successfully",
      orgs: orgs,
    });
  }

   
}
