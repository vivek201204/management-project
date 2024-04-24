"use client";
import { useForm } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { login as authLogin } from "../../../../store/auth/authSlice";
import { session } from "../../../../constants/session";
import { AppDispatch } from "../../../../store/store";

function page() {
  const { register, handleSubmit } = useForm();
  const router = useRouter();
  const dispatch : AppDispatch = useDispatch();
  const session = useSession()

 

  const login = async (data: any) => {
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });
    if (!res?.ok) {
      console.log("something went wrong");
      return;
    }

    const user =  session.data?.user
    if (!user) {
      return;
    }
    dispatch(authLogin(user))
    console.log(res);

    router.push("/");
  };
  
  return (
    <div>
      <form onSubmit={handleSubmit(login)}>
        <input type="text" {...register("email")} />
        <input type="text" {...register("password")} />
        <button>Login</button>
      </form>
    </div>
  );
}

export default page;
