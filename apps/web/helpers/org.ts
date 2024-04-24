import {get} from "../redis/org/get"
import { authOptions } from "../app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"

const userSession = async() => {
    const session = await getServerSession(authOptions)
    if (!session) {
        return null
    }
    const user = session.user
    return user
}
export const cache = async () =>{
    const user = await userSession()
    if (!user) {
        return null
    }
    const ans = await get(user.name)
    return ans
} 