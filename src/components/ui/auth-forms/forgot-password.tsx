"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { requestPasswordUpdate } from "@/utils/auth-helpers/server";
import { handleRequest } from "@/utils/auth-helpers/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "../input";
import { CardHeader, CardTitle, CardDescription, CardContent } from "../card";

// Define prop type with allowEmail boolean
interface ForgotPasswordProps {
  redirectMethod: string | null;
}

export default function ForgotPassword({
  redirectMethod,
}: ForgotPasswordProps) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = redirectMethod === "client" ? useRouter() : null;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true); // Disable the button while the request is being handled
    await handleRequest(e, requestPasswordUpdate, router);
    setIsSubmitting(false);
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl text-center">fugue-state.io</CardTitle>
        <CardDescription className="text-lg">Forgot Password</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          noValidate={true}
          className="mb-4"
          onSubmit={(e) => handleSubmit(e)}
        >
          <div className="grid gap-2">
            <div className="grid gap-1">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                name="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                className="w-full"
              />
            </div>
            <Button
              variant="default"
              type="submit"
              className="mt-1"
              loading={isSubmitting}
            >
              Send Email
            </Button>
          </div>
        </form>
        <div className="mt-4 text-center text-sm">
          <Link href="/signin" className="font-light text-sm">
            Sign In
          </Link>
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signin/signup" className="font-light text-sm">
            Sign up
          </Link>
        </div>
      </CardContent>
    </>
  );
}
