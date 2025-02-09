"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signInWithPassword } from "@/utils/auth-helpers/server";
import { handleRequest } from "@/utils/auth-helpers/client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Input } from "../input";
import { CardContent, CardDescription, CardHeader, CardTitle } from "../card";
import { Label } from "../label";
import OauthSignIn from "./oauth-signin";

// Define prop type with allowEmail boolean
interface PasswordSignInProps {
  redirectMethod?: string | null;
}

export default function PasswordSignIn({
  redirectMethod,
}: PasswordSignInProps) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = redirectMethod === "client" ? useRouter() : null;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true); // Disable the button while the request is being handled
    await handleRequest(e, signInWithPassword, router);
    setIsSubmitting(false);
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl text-center">fugue-state.io</CardTitle>
        <CardDescription className="text-lg">Sign In</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          noValidate={true}
          className="mb-4"
          onSubmit={(e) => handleSubmit(e)}
        >
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/signin/forgot_password"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full" loading={isSubmitting}>
              Sign In
            </Button>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/signin/signup"
                className="underline underline-offset-4"
              >
                Sign up
              </Link>
            </div>
            <OauthSignIn />
          </div>
        </form>
        <div className="mt-4 text-center text-sm">
          <Link href="/signin/email_signin" className="font-light text-sm">
            Sign in via magic link
          </Link>
        </div>
      </CardContent>
    </>
  );
}
