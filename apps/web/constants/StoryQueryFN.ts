import axios from "axios"


export const getStory = async(storyId : string) => {
   const {data} =  await axios.get(`/api/org/story/get-story?storyID=${storyId}`)
  console.log(data);
  
   return data.story
}

export const SearchStory = async (storyName : string) =>{
   const {data} = await axios.get(`/api/org/story/search-story?storyName=${storyName} `)

   return data.story
}

export const getTasks = async (storyID : string) => {
   const {data} = await axios.get(`/api/org/story/task/get-tasks?storyID=${storyID}`)

   return data
}