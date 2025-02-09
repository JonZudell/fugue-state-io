"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";
import { signUp } from "@/utils/auth-helpers/server";
import { handleRequest } from "@/utils/auth-helpers/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "../input";
import { CardContent, CardDescription, CardHeader, CardTitle } from "../card";

// Define prop type with allowEmail boolean
interface SignUpProps {
  redirectMethod: string | null;
}

export default function SignUp({ redirectMethod }: SignUpProps) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = redirectMethod === "client" ? useRouter() : null;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true); // Disable the button while the request is being handled
    await handleRequest(e, signUp, router);
    setIsSubmitting(false);
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl text-center">fugue-state.io</CardTitle>
        <CardDescription className="text-lg">Sign Up</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          noValidate={true}
          className="mb-4 text-sm"
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
              <label htmlFor="password">Password</label>
              <Input
                id="password"
                placeholder="Password"
                type="password"
                name="password"
                autoComplete="current-password"
                className="w-full"
              />
              <label htmlFor="passwordConfirm">Confirm Password</label>
              <Input
                id="passwordConfirm"
                placeholder="Password"
                type="password"
                name="passwordConfirm"
                autoComplete="current-password"
                className="w-full"
              />
            </div>
            <Button
              variant="default"
              type="submit"
              className="mt-1"
              loading={isSubmitting}
            >
              Sign up
            </Button>
          </div>
        </form>

        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/signin" className="font-light text-sm">
            Sign In
          </Link>
        </div>
      </CardContent>
    </>
  );
}
