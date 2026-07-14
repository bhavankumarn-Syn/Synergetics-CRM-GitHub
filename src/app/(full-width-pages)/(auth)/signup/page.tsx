import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SignUp Page | Synergetics Dashboard Template",
  description: "Streamlined lead collection for smarter decisions.",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
