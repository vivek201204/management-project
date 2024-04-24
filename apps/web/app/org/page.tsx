"use client";
import React, { useState } from "react";
import { fetch } from "../../constants/OrgQueryFN";
import { Org, User } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { inOrg } from "../../store/org/orgSlice";
import { AppDispatch } from "../../store/store";
import { useSocket } from "../custom-Hooks/SocketProvider";
import { ORGExtends } from "../../constants/ExtendsOrgType";
import { Button } from "@mui/material";
import { AvatarGroup, Avatar as MaterialAvatar, Skeleton } from "@mui/material";

function page() {
  const dispatch: AppDispatch = useDispatch();
  const queryClient = useQueryClient();
  const { joinRoom } = useSocket();

  const RoomJoin = async (roomName: string) => {
    const res = await joinRoom(roomName);
    console.log(`join Room Response ${res} `);
    return res;
  };

  const { data: orgs, isFetching } = useQuery({
    queryKey: ["orgs"],
    queryFn: fetch,
    staleTime: 100000,
  });
  console.log(orgs);

  const router = useRouter();

  const visit = async (org: ORGExtends) => {
    dispatch(inOrg(org));

    const res = await RoomJoin(org.socketRoomName);
    console.log(`vist wala res ${res}`);

    if (res) {
      await queryClient.invalidateQueries({queryKey : ["org"] })

      router.push(`org/${org.id}`);
    }
  };

  if (isFetching) {
    return (
      <>
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={200} />
        <br />

        <Skeleton variant="rectangular" width={210} height={60} />

        <Skeleton variant="rounded" width={210} height={60} />
      </>
    );
  }
  console.log(orgs, "orgs");

  return (
    <div className=" ">
      <div className="flex flex-row justify-center mr-52">
        <Button
          variant="outlined"
          color="inherit"
          children="Create Organization"
          onClick={() => router.push("/org/create-org")}
        ></Button>
      </div>
      {orgs?.map((org: ORGExtends) => (
        <div className=" group hover:border-blue-600 ">
          <section
            className=" cursor-pointer h-64  m-5 group-hover:border-cyan-900 border  border-blue-100 rounded-lg "
            onClick={() => visit(org)}
          >
            <div className=" h-11 w-16  ml-6 mt-5 pt-2">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div className=" mt-8 ml-6">
              <h1 className=" text-xl">{org.name}</h1>

              <p className=" text-slate-600">{org.headline}</p>
              <div className=" mt-2 flex flex-row justify-start">
                <AvatarGroup max={org.employeeID.length}>
                  <MaterialAvatar src="https://github.com/shadcn.png" />
                  <MaterialAvatar src="https://github.com/shadcn.png" />
                  <MaterialAvatar src="https://github.com/shadcn.png" />
                  <MaterialAvatar src="https://github.com/shadcn.png" />

                </AvatarGroup>
              </div>
            </div>
          </section>
        </div>
      ))}
    </div>
  );
}

export default page;
