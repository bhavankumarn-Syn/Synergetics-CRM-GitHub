"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";


const signInSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignInForm() {

  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false)
  const [respErr, setRespErr] = useState('')
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<SignInFormData>({
    email: "",
    password: "",
  });
   const [formErrors, setFormErrors] = useState<Record<string, string>>({});


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };


  const onSubmit = async (e: React.FormEvent)=>{
    e.preventDefault();
    setLoading(true)
    setFormErrors({}); // reset client errors
  
    try {

      const parsedData = signInSchema.parse(formData);

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log('result --', result)

      if (!response.ok) {
        
        setRespErr(result.error)
        throw new Error(result.error || "Failed to login");
        
      } else{
        setRespErr('')
        localStorage.setItem('token',result?.user?.token )
        console.log('result. result ', result.user)
        localStorage.setItem('usinfo', JSON.stringify(result?.user) )
        const redirect = searchParams.get("redirect");
        router.push(redirect || "/");
      }
     
    } catch (error: any) { 
          if (error instanceof z.ZodError) {
            // ✅ Collect field-specific errors
            const fieldErrors: Record<string, string> = {};
            error.issues.forEach((issue) => {
              const field = issue.path[0] as string;
              fieldErrors[field] = issue.message;
            });
            setFormErrors(fieldErrors);
          } else {
            setRespErr((error as Error).message); // backend/network error
          }
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <div>
            
            <form onSubmit={onSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input placeholder="info@gmail.com" name="email" type="email" error={!!formErrors.email} value={formData.email} onChange={handleChange}/>
                  {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      name="password"
                      error={!!formErrors.password}
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-[24px]"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                    {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span> */}
                  </div>
                  <Link
                    href="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  <Button className="w-full" size="sm" disabled={loading}>
                    {loading ? "Signing in..." : "Sign in"}
                  </Button>
                </div>
            
                 {respErr && <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-2 rounded text-[13px]">{respErr}</div>}
              </div>
            </form>

            {/* <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account? {""}
                <Link
                  href="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
