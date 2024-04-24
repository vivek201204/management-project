"use client"
import { dividerClasses } from "@mui/material";
import React , {useState} from "react";
import {useForm} from "react-hook-form"
import UserQueryPage from "./UserQueryPage";
import OrgQueryPage from "./OrgQueryPage";

interface FormValues {
    users : boolean;
    orgs : boolean;
  }

function SearchLayout() {
    // const {register , setValue  , watch} = useForm<FormValues>({
    //     defaultValues : {
    //        users : true ,
    //        orgs : false
    //     }
    // })

    const [users , setUsers] = useState<boolean>(true)
    const [orgs , setOrgs] = useState<boolean>(false)
   
    // const users = watch("users")
    // const orgs = watch("orgs")

    const handleCheckboxChange = (name: keyof FormValues) => {
        if (name === 'users' && !users) {
          setUsers( true);
          setOrgs( false);
        } else if (name === 'orgs' && !orgs) {
          setUsers( false);
          setOrgs( true);
        }
      };
  return (
    <>
    <div className=" flex flex-row gap-24">
       
        {/* <div className=" flex flex-row gap-3">
        <label htmlFor="user">user</label>
        <input type="checkbox" id="user" {...register("users")} onChange={() => handleCheckboxChange('users')} checked={users}  />
      </div>

      <div className=" flex flex-row gap-3">
        <label htmlFor="orgs" >orgs</label>
        <input type="checkbox" id="orgs" {...register("orgs")} checked={orgs} onChange={() => handleCheckboxChange('orgs')}  /> */}

        <button onClick={()=> handleCheckboxChange("users")}>users</button>
        <button onClick={()=> handleCheckboxChange("orgs")}>orgs</button>
      </div>
      
      <div>
        {users && <div> <UserQueryPage /> </div>}
        {orgs && <div> <OrgQueryPage /> </div>}
      </div>
      </>
    
  );
}

export default SearchLayout;
