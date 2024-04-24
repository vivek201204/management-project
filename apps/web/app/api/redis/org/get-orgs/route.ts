import { NextRequest, NextResponse } from "next/server";
import { Org } from "@prisma/client";
import { client } from "../../../../Rdeis";


const fn =  async (ans : Array<string>  , orgs : Array<Org> , index : number) : Promise<Array<Org>> =>{
  
    if (ans.length -1  < index) {
      return orgs
    }
     const org =  await client.hgetall(`${ans[index]}` , (err , data)=>{
      if (err) {
        console.log( "error occuer" , err);
      }
      else{
        if (data) {
          const splitStoryId = data.storyId?.split(",") 
          const splitOwnerID = data.ownerID?.split(",") 
          const updatedAt = new Date(data.updatedAt || "")
          const createdAt = new Date(data.createdAt || "")
       
          const Convert : Org = {
           code : data.code ? data.code : "" ,
           email : data.email ? data.email : "" ,
           storyId : splitStoryId ? splitStoryId : [],
           id : data.id ? data.id : "" ,
           avatar : data.avatar ? data.avatar : "" ,
           coverImage : data.coverImage ? data.coverImage : "" ,
           headline : data.headline ? data.headline : "" ,
           socketRoomName : data.socketRoomName ? data.socketRoomName : "",
           updatedAt : updatedAt,
           ownerID : splitOwnerID ? splitOwnerID : [] ,
           bio : data.bio ? data.bio : "",
           dbOrgName : data.dbOrgName ? data.dbOrgName  : "",
           createdAt : createdAt ,
           name : data.name ? data.name : ""
          }
           orgs.push(Convert)
        }
        else {
          console.log("cannot get data");
          
        }
   
      }
     })
  
     
    const returnorgs : Array<Org>  =   await fn(ans , orgs , index+1)
  
  
    return returnorgs
     
  }

export async function GET(req : NextRequest) {

    const searchParams = req.nextUrl.searchParams
    const hashkey = searchParams.get("hashkey")
    if (!hashkey) {
        console.log("hashkey nahi hai");
       
    }

    let orgs:   Array<Org>  = []
  
  const ans = await client.keys(`${hashkey}-org:*`);
 console.log(ans);
 
  const fnn  = await fn(ans , orgs , 0)

  return NextResponse.json({
    message : "user orgs fetched successfully" ,
    orgs : fnn ,
    status : true
  } )


}