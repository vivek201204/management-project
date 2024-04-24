import {z} from "zod"


export const signUpSchema = z.object({
    email : z.string().email("please enter a valid email"),

    name : z.string()
    .min(2 , "name required atleast 2 characters")
    .max(30 , "name only contains 30 characters") ,

    password : z.string()
    .min(8 , "password required atleast 8 characters")
    .max(20 , "password only must contains 20 characters") ,

    confirmPassword : z.string()
})
.refine((data)=>data.password === data.confirmPassword , {
    message : "password not match",
    path : ["confirmPassword"]
})

export type TsignUpSchema = z.infer<typeof signUpSchema>

export const createOrgSchema = z.object({
    email : z.string().email("please enter a valid email") ,
    name : z.string()
    .min(2 , "name required atleast 2 characters") 
    .max(50 , "Organization name must only contains 50 characters")   
})

export type TcreateOrgSchema = z.infer<typeof createOrgSchema>

export const updateOrgSchema = z.object({
    email : z.string().email("please enter a valid email ") ,
    name : z.string()
    .min(2 , "name required Atlease 2 characters")
    .max(50 , "Organization name must only contains 50 characters")  ,
    
    bio : z.string()
    .min(30 , "About us requires atleast 30 characters")
    .max(1500 , "About us content words reached " ) ,

    headline : z.string() 
    .min(10  , "Headline requires atleast 10 characters ")
    .max(100 , "Headline can only contains 100 characters")
})

export type TupdateSchema = z.infer<typeof updateOrgSchema>

 export const updateCoverImageSchema = z.object({
     coverImage : z.string().nonempty()
 })

 export type TupdateCoverImage = z.infer<typeof updateCoverImageSchema>