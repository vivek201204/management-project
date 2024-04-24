"use client"
import React , {useEffect , useState} from "react";
import Link from "next/link";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../@/components/ui/avatar";
import { CgProfile } from "react-icons/cg"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../store/store";
import { HiMiniHome } from "react-icons/hi2";
import { TbLogin2 } from "react-icons/tb"
import { AiFillMessage } from "react-icons/ai";
import { GoOrganization } from "react-icons/go"
import { FaUserFriends } from "react-icons/fa";
import { MdAddTask } from "react-icons/md"
import { FaSearch } from "react-icons/fa"
import { BsFilePost } from "react-icons/bs"
import {Autocomplete , TextField , Avatar as MaterialAvatar} from "@mui/material"
import { useRouter } from "next/navigation";
import {useForm} from "react-hook-form"
import { useQueryClient } from "@tanstack/react-query";
import { inQuery } from "../../store/query/querySlice";
import { MdOutlineNotificationsOff } from "react-icons/md";

interface navigationItems {
  name: string;
  slug: string;
  active : boolean ,
  icon : any
}
function MyLayout({ children }: { children: React.ReactNode }) {
 const router = useRouter()
const  {status}  =  useSelector((state:RootState)=>state.auth)
const queryClient = useQueryClient()
const [isAuthenticate , setIsAuthenticate] = useState(false)
const dispatch : AppDispatch = useDispatch()

useEffect(()=>{
 if (status===true) {
  setIsAuthenticate(true)
 }
 else{
  setIsAuthenticate(false)
 }
} , [status])

 const {register  , handleSubmit} = useForm()

 const onSubmit = async (data: any) => {
  const query = data.searchQuery.trim();
  if (query !== '') {
    await queryClient.invalidateQueries({queryKey : ["search/user"]})
    dispatch(inQuery(query))
    router.push(`/Search`);
  }
};


  const items: navigationItems[] = [
    {
      name: "Search",
      slug: "/Search",
      active : true ,
      icon : <FaSearch />
    },
    {
      name: "Message",
      slug: "/message/friends",
    active : true ,
    icon : <AiFillMessage />
    },
    {
      name : "Post",
      slug : "/posts" ,
      active : true ,
      icon : <BsFilePost />
    } ,
    // {
    //   name : "Login",
    //   slug : "/users/auth/login" ,
    //   active : !isAuthenticate ,
    //   icon : <TbLogin2 />
    // } ,

    {
      name: "Organization",
      slug: "/org",
      active : true ,
      icon : <GoOrganization />
    },
    {
      name: "Friends",
      slug: "/friends",
     active : true ,
     icon : <FaUserFriends />
    },
    {
      name: "Tasks",
      slug: "/tasks",
     active : true ,
     icon : <MdAddTask />
    },
  ];
  const options = ['The Godfather', 'Pulp Fiction']
  return (
    <>

      <div className=" flex flex-row">
        <nav className=" flex flex-row bg-slate-50">
          <div className=" h-screen w-56 bg-white-950 border border-black">
            <div className=" h-20 w-full  flex flex-row justify-center items-center bg-white-950 border border-b-black  ">
              <Link href="/">Pro-Perly</Link>
            </div>
            <div>
              {items.map((item) => item.active ?  (
                <div className="pt-9 pl-16" key={item.slug}>
                  <Link className=" text-lg flex flex-row gap-1" key={item.slug} href={item.slug}>
                  {item.icon}
                    {item.name}
                  </Link>
                </div>
              ): null)}
             
            </div>
          </div>
        </nav>
       <div className="w-full h-screen overflow-auto ">
          <div className=" h-20 flex flex-row border border-black bg-slate-50 items-center ">
            <div className=" pl-12   flex items-center">
             <form onSubmit={handleSubmit(onSubmit)}>
             <input
              
              {...register("searchQuery")}
             
               />
               <button type="submit">Search</button>
             </form>
            </div>
           
           
           
            <div className=" pl-96 flex items-center  ">
            <MdOutlineNotificationsOff className=" text-2xl mr-6 cursor-pointer" onClick={()=> router.push("/notifications")} />
           
              <MaterialAvatar src="https://github.com/shadcn.png" />
            </div>
          </div>

          <div className=" pl-9 pt-6 bg-white   ">{children}</div>
          </div>
      </div>
        
       
      
    </>
  );
}

export default MyLayout;
