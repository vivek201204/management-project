import { Org } from "@prisma/client"
import { User } from "@prisma/client"
export interface ORGExtends extends Org {
    owner : Array<User> ,
    
  }