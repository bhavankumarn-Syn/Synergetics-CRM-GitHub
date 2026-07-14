"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { z } from "zod";



const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["USER", "ADMIN", "SUPER_ADMIN"]).default("USER"),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

function FormRender() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false)
  const [respErr, setRespErr] = useState('')
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const router = useRouter()
  const { executeRecaptcha } = useGoogleReCaptcha();

 
  const [formData, setFormData] = useState<SignUpFormData>({
    name: "",
    email: "",
    password: "",
    role:"USER"
  });

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

        const parsedData = signUpSchema.parse(formData);

        if (!executeRecaptcha) {
          alert("Recaptcha not ready");
          return;
        }

        // Run reCAPTCHA v3 with action name "register"
        const captchaToken = await executeRecaptcha("register");
  
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/users/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...parsedData, "g-recaptcha-response": captchaToken }),
        });
  
        const result = await response.json();
  
        if (!response.ok) {
          
          setRespErr(result.error)
          throw new Error(result.error || "Failed to signup");
          
        } else{
          setRespErr('')
         
          router.push("/signin");
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
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign up!
            </p>
          </div>
          <div>
            
            <form onSubmit={onSubmit}>
              <div className="space-y-5">
               
                <div className="">
                  <Label>
                    Name<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="fname"
                    name="name"
                    error={!!formErrors.name}
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                  />
                  {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                </div>
                 
               
                {/* <!-- Email --> */}
                <div>
                  <Label>
                    Email<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    error={!!formErrors.email}
                    value={formData.email}
                    onChange={handleChange}
                    name="email"
                    placeholder="Enter your email"
                  />
                  {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                </div>
                {/* <!-- Password --> */}
                <div>
                  <Label>
                    Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      error={!!formErrors.password}
                      value={formData.password}
                      name="password"
                      onChange={handleChange}
                    />

                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
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
                
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Signing up..." : "Sign Up"}
                  </button>
                </div>
                {respErr && <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-2 rounded text-[13px]">{respErr}</div>}
    
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Already have an account?
                <Link
                  href="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



export default function SignUpForm() {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}>
      <FormRender />
    </GoogleReCaptchaProvider>
  );
}
