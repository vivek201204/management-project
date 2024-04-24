import { Org, Story, User } from "@prisma/client";
import axios from "axios";
import { TbEaseInControlPoint } from "react-icons/tb";
import { TcreateOrgSchema, TupdateSchema } from "./zodTypes";
import { ORGExtends } from "./ExtendsOrgType";
import { useQueryClient } from "@tanstack/react-query";

interface orgType extends Org {
  owner: Array<User>,
  employees: Array<User>
}


export interface ReturncreateOrgData {
  message: string,
  org: ORGExtends
}

// extends org for only ParticularOrg GET 
interface OrgExtendsForParticularOrg extends Org {
  owner: Array<User>
  employees: Array<User>
}
export interface ReturnGetORG {
  message: string,
  org: OrgExtendsForParticularOrg
}
export interface OrgStories {
  message: string,
  stories: Array<Story>
}

export interface updateOrgReturn {
  message: string,
  updateOrg: Org,
  success: boolean
}

// This posts type is only for get Org


// this org type is particular for only getOrg 
interface OrgTypes {
  id: string
  avatar: string | null
  name: string,
  employeeID: Array<string>,
  bio: string | null,
  coverImage: string | null,
  email: string,
  headline: string | null,
  ownerID: Array<string>
  owner: {
    name: string,
    avatar: string | null
    email: string

  }
  posts: Array<Iposts>
  story: Array<story>
}
interface story {
  employeeID: Array<string>,
  id: string,
  name: string,
  socketRoomName: string,
  manager : author | null
}

export interface Iposts {
  comments: Array<comments>
  photo: string | null
  impressions: number
  isActive: boolean
  likes: Array<likes>
  videoFile: string | null,
  videoDuration: string | null,
  title: string | null,
  createdAt: Date,
  postOwner: author


}

interface comments {
  content: string
  author: author
  likes: Array<likes>
}
interface author {
  avatar: string | null
  name: string
}

interface likes {
  likedBy: author
}

export interface getOrgType {
  message: string
  org: OrgTypes
}


export const fetch = async () => {
  const { data } = await axios.get("/api/org/get-orgs")
  console.log("fetch", data);
  return data.orgs

}




export const getOrg = async (orgID: string): Promise<OrgTypes> => {

  const { data }: { data: getOrgType } = await axios.get(`/api/org/get-org?orgID=${orgID}`)

  return data.org
}


export const fetchOrgStories = async (orgID: string) => {

  const { data }: { data: OrgStories } = await axios.get(`/api/org/story/org-stories?orgId=${orgID}`)

  console.log(data);

  return data.stories
}

export const fetchOrgPosts = async (orgID: string) => {
  const { data } = await axios.get(`/api/post/get-org-posts?orgID=${orgID}`)
  if (!data) {
    return null
  }
  return data
}

export const createOrg = async (comingData: TcreateOrgSchema) => {
  const { data }: { data: ReturncreateOrgData } = await axios.post("/api/org/create-org", comingData)

  if (!data) {
    return null
  }
  return data
}

export const updateOrg = async (comingData: TupdateSchema, OrgID: string) => {
  const { data }: { data: updateOrgReturn } = await axios.post(`/api/org/update-org-intro?orgID=${OrgID}`, comingData)
  if (!data) {
    return null
  }
  console.log(data);

  return data
}
