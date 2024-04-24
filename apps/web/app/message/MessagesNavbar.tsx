"use client"
import Link from 'next/link'
import React , {useState} from 'react'
import { useRouter } from 'next/navigation'
interface item {
  slug : string ,
  isActice : boolean ,
  name : string
}
function MessagesNavbar() {
    const [friends , setIsFriends] = useState(true) 
    const [Organizations , setOrganizations] = useState(false) 
    const [stories , setStories] = useState(false) 
    const navitems : Array<item> = [
        {
            name : "friends" ,
            isActice : friends ,
            slug : "/message/friends"
        } ,
        {
            name : "Organizations" ,
            isActice : Organizations ,
            slug : "/message/organizations"
        } ,
        {
            name : "stories" ,
            isActice : stories ,
            slug : "/message/stories"
        }
    ]

  return (
    <div className=' h-6 flex flex-row justify-center items-center gap-9' >
      {
        navitems.map((item) => (
            <Link className={item.isActice ? ` text-red-950` : ""} href={item.slug}>{item.name}</Link>
        ))
      }
    </div>
  )
}

export default MessagesNavbar