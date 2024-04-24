"use client"
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { useQuery } from '@tanstack/react-query'
import { searchOrgs, searchedItems } from '../../constants/SearchQueryFn'
import { Avatar } from '@mui/material'
import { useRouter } from 'next/navigation'

function OrgQueryPage() {
    const query = useSelector((state : RootState)=> state.query.query)
    const router = useRouter()
    if (!query){
     return <div> Something went worng</div>
    }
    const {data : orgs, isLoading} = useQuery({
        queryKey : ["search/orgs"] ,
        queryFn : async () => await searchOrgs(query)
    })
    if (isLoading) {
        return <div>Orgs Loading</div>
    }
    console.log( "orgs" ,orgs);
    
    const visitOrg = (org : searchedItems) => {
       router.push(`/org/${org.id}`)
    }
    
  return (
    <div>
         {orgs?.status ? 
          <div>
            {orgs.orgs.map((org)=>(
                <>
                <Avatar key={org.avatar} src={org.avatar ? org.avatar : ""}></Avatar>
                <h1 key={org.name}>{org.name}</h1>
                <button onClick={()=> visitOrg(org)}> visit</button>
                </>
            ))}
          </div>
         : <div> 
            <h1>Soory Cant find Ogrs with Query</h1>
            </div>}
    </div>
  )
}

export default OrgQueryPage