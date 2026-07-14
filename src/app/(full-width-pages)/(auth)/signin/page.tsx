"use client"

import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";
import { useRouter } from "next/navigation";


export default function SignIn() {
  // const router = useRouter();
  // const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  // if (token) {
  //   router.push("/");
  // }
  
  return <SignInForm />;
}
