"use client";
import { getOrg } from "../../../constants/OrgQueryFN";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { MdPhotoSizeSelectActual } from "react-icons/md";
import { useSession } from "next-auth/react";
import { MdEdit } from "react-icons/md";
import PostCard from "./employees/Postss";
import { RiFileUploadLine } from "react-icons/ri";
import { useState } from "react";
import {SubmitHandler, useForm} from "react-hook-form"
import { updateCoverImage } from "../../../constants/PostQueryFN";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { TupdateCoverImage, updateCoverImageSchema } from "../../../constants/zodTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { log } from "console";


interface ParamsType {
  org: string;
}
export interface Idata {
  image : File 
}

function Orgg({ params }: { params: ParamsType }) {
  const session = useSession();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const queryClient  = useQueryClient()
  const {mutate : updateCoverimage , isPending : coverImagePending} = useMutation({
    mutationFn : async (data : File) => await updateCoverImage(params.org , data) ,
    onSuccess : () => {
      queryClient.invalidateQueries({queryKey : ["org"] })
    }
  })

  const {register , handleSubmit} = useForm<TupdateCoverImage>({
    resolver : zodResolver(updateCoverImageSchema)
  }) 

  const { data: org, isPending } = useQuery({
    queryKey: ["org"],
    queryFn: async () => await getOrg(params.org),
  });
  if (isPending) {
    return <div>org loading</div>;
  }

  if (!org) {
    return <div>org nahi hai</div>;
  }

  if (!session) {
    <h1>Firstly User Login</h1>;
  }
  if (!session.data) {
    return <h1>something went wrong</h1>;
  }

 

  const submitCoverImage : SubmitHandler<TupdateCoverImage> = async (data ) =>{
   console.log("clicked");
   
  console.log( "image",data);

  const file = data.coverImage[0]

  await updateCoverimage(file)
    
    
  }
  const user = session.data.user;

  return (
    <div className=" ">
      <section className=" flex flex-row">
        <main className=" w-11/12">
          <div className=" h-screen  w-full ">
            <div className=" border border-black h-48 w-4/5  rounded-md">
              {org.coverImage ? (
                <img src={org.coverImage} className=" h-full w-full" alt="" />
              ) : (
                <div className=" h-full w-full flex flex-row justify-center items-center ">
                  {previewURL ?  
                  <img src={previewURL ? previewURL : ""} alt="image selected" className="mt-2 max-w-full h-auto" />
                  : 
                  <form onSubmit={handleSubmit(submitCoverImage)} >
                  <label htmlFor="file-input" className="cursor-pointer flex items-center space-x-2"><RiFileUploadLine className="w-6 h-6" /></label>
                  
                  <input
                   id="file-input"
                    type="file"
                    // accept="image/*"// Define accepted file types
                      // className="sr-only" // Hide the default file input
                     {...register("coverImage")}
                  />
                  <button  type="submit">Submit</button>
                  </form>
                  }
                 
                </div>
              )}
              <div className=" h-24 w-24 border border-black rounded-full -mt-12 ml-8">
                <img src={org.avatar ? org.avatar : ""} alt="" className=" w-full h-full rounded-full"  />
              </div>
              {org.ownerID.includes(user.id) ? (
                <div className=" flex flex-row-reverse -mt-3 ">
                  <Link
                    href={`/org/${org.id}/edit`}
                    className=" h-8 w-10  -mt-2 flex flex-row items-center justify-center  hover:bg-slate-100 hover:rounded-full"
                  >
                    <MdEdit className=" text-2xl cursor-pointer" />
                  </Link>
                </div>
              ) : null}
            </div>

            <div className=" mt-16 w-11/12 flex flex-row items-center gap-64">
              <h1 className=" text-2xl ml-4 text-black"> {org?.name}</h1>
              <Link
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${org.email}`}
                className=" text-lg cursor-pointer hover:text-blue-600 hover:underline"
              >
                {org?.email}
              </Link>
            </div>

            <h2 className=" text-slate-900   mt-3 w-2/3 mr-4 ">
              {" "}
              {org?.headline}
            </h2>

            <Link href="/" className=" text-blue-800 text-base mt-4 ">
              {org?.employeeID.length} people working
            </Link>
            {org.ownerID.includes(user.id) ? (
              <button>Add Employee</button>
            ) : null}
            <div className=" h-96 w-4/5  mt-8 flex overflow-x-auto gap-3">
              {org.posts.map((post) => (
                // <div className=" h-2/5 border border-black  flex flex-row">
                //  <img className=" h-32 w-44 mt-3" src={post.photo ? post.photo : ""} alt="" />

                // </div>

                <PostCard post={post}></PostCard>
              ))}
            </div>
          </div>
        </main>
        <div className=" h-96 w-72 mr-8 border border-black rounded-md ">
          {/* {org.owner.map((owner) => (
            <>
              <h1 className=" pl-8"> Owner </h1>
              <h1 className=" pl-8"> </h1>
            </>
          ))} */}
        </div>
      </section>
      <div>
        {/* {org.story
        ? org.story.map((story) => (
            <div className=" h-56 w-11/12  border border-black mt-48 ">
              {story.id}
            </div>
          ))
        : null} */}
      </div>
    </div>
  );
}

export default Orgg;
