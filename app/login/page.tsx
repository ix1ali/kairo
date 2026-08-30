import { Suspense } from "react";
import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { currentUser } from "@/lib/auth";

export const metadata = { title: "Log in" };

export default async function LoginPage() {
  if (await currentUser()) redirect("/dashboard");
  return (
    <Suspense>
      <AuthForm mode="login" />
    </Suspense>
  );
}
