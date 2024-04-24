"use client"

import { useSocket } from "./custom-Hooks/SocketProvider";



  function page() {
  // const set = await client.set("string:1" , "Hey Redis")
  // const get = await client.get("string:1")

  const {joinRoom} = useSocket()
 
  const RoomJoin = async() =>{
    const res = await joinRoom("65f034890a6e1bc1676affd5_jassi")
    console.log("room status " , res);
    
  }

  return (
   <button onClick={RoomJoin}>Join Room</button>
  );
}

export default page;
