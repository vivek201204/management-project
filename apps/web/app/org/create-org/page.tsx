"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrg as OrgCreataFunction } from "../../../constants/OrgQueryFN";
import { useRouter } from "next/navigation";
import OrgImage from "./OrgImage";
import { Input } from "../../../@/components/ui/input";
import { TcreateOrgSchema, createOrgSchema } from "../../../constants/zodTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppDispatch } from "../../../store/store";
import { useDispatch } from "react-redux";
import { inOrg } from "../../../store/org/orgSlice";
import { useSocket } from "../../custom-Hooks/SocketProvider";
import { ORGExtends } from "../../../constants/ExtendsOrgType";
import { Button } from "@mui/material";

function page() {
  const { register, handleSubmit } = useForm<TcreateOrgSchema>({
    resolver: zodResolver(createOrgSchema),
  });
  const queryClient = useQueryClient();
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const { joinRoom } = useSocket();

  const {
    mutate: createOrg,
    isPending,
    data,
  } = useMutation({
    mutationFn: async (data: TcreateOrgSchema) => await OrgCreataFunction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orgs"] });
    },
  });

  const create: SubmitHandler<TcreateOrgSchema> = async (comingData) => {
    console.log("clicked");
    createOrg(comingData);
  };

  const RoomJoin = async (roomName: string) => {
    const res = await joinRoom(roomName);
    console.log(`join Room Response ${res} `);
    return res;
  };

  const visit = async (org: ORGExtends) => {
    dispatch(inOrg(org));

    const res = await RoomJoin(org.socketRoomName);
    console.log(`vist wala res ${res}`);

    if (res) {
     await queryClient.invalidateQueries({queryKey : ["orgStories"]})
     await queryClient.invalidateQueries({queryKey : ["posts"]})
     router.push(`/org/${org.id}`);
     
    }
  };


 


  return ( 
    <>
      <div>
        <h1 className=" pt-8 text-4xl text-slate-600">
         {data ? "Organization Created Successfully" : "Make Your Own Organization"}
        </h1>
        <div className="  h-96 w-2/5 mt-8">
          <form onSubmit={handleSubmit(create)}>
            <div className=" flex flex-col gap-4 ">
              <label htmlFor="name">Name</label>
              <Input
                className=" pl-6 h-12"
                {...register("name")}
                autoFocus={true}
                type="text"
                placeholder="Enter Organization Name"
                disabled = {data ? true : false}
              />

              <label htmlFor="email">Email</label>
              <Input
                className=" pl-6 h-12"
                {...register("email")}
                autoFocus={true}
                type="text"
                placeholder="Enter Organization Email"
                disabled = {data ? true : false}
              />

              {/* <Button  color="inherit" variant="outlined" size="large" children={isPending ? "Creating" : "Create Organization"}/> */}
             {data ? <button onClick={()=> visit(data.org)}>Visit Organization</button> :  <button>{isPending ? "CREATING" : "CREATE ORGANIZATION"}</button> }
            </div>
          </form>
        </div>
       
      </div>
      <div className=" w-1/2 ml-auto mr-6 -mt-96 ">
        <OrgImage />
      </div>
    </>
  );
}

export default page;
