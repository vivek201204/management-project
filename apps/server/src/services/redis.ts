import {Redis} from "ioRedis"
import { Server } from "socket.io"
import { message } from "./socket"

class RedisService {
    private io:Server
    private pub:Redis
    private sub:Redis
    private subscribedChannels: Set<string>;

    constructor(io:Server){
        this.io= io
        this.pub = new Redis()
        this.sub = new Redis()
        this.subscribedChannels = new Set();
    };

    public async publishToRoom(roomName:string,Message:message): Promise<void> {
              await this.pub.publish(roomName,JSON.stringify(Message) ,(err , result)=>{
                if (err) {
                    console.log(`error while publish to channel ${roomName}  `);   
                    return err
                }
                else {
                    console.log(`publish to channel ${roomName} and the message is ${Message}`);   
                }})
    }


    public async subscribeToRoom(roomName:any): Promise<void>{

        if (this.subscribedChannels.has(roomName)) {
            console.log(`Already subscribed to Redis channel: ${roomName}`);
            return;
          }

        await this.sub.subscribe(roomName,(err , result)=>{
            if (err) {
                console.log(`error while subscribe to channel ${roomName} `);   
                return err
            }
            else {
                console.log(`subscribe to channel ${roomName}`);   
                this.subscribedChannels.add(roomName);
            }})


            this.sub.on("message",(channel:string,Message:string)=>{
                if (channel===roomName) {
                    const parsedMessage : message = JSON.parse(Message)
                    this.io.to(roomName).emit("RecivedMessage" , parsedMessage)
                   
                    
                }
            })
    }
get pubLisher(){
    return this.pub
}
get subscribe(){
    return this.sub
}
}
export{RedisService}