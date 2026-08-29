import { Suspense } from "react";
import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { currentUser } from "@/lib/auth";

export const metadata = { title: "Create your account" };

export default async function SignupPage() {
  if (await currentUser()) redirect("/dashboard");
  return (
    <Suspense>
      <AuthForm mode="signup" />
    </Suspense>
  );
}
