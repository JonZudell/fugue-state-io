"use client";
import { Button } from "@/components/ui/button";
import { signInWithOAuth } from "@/utils/auth-helpers/client";
import { type Provider } from "@supabase/supabase-js";
import { Github } from "lucide-react";
import { JSX, useState } from "react";

type OAuthProviders = {
  name: Provider;
  displayName: string;
  icon: JSX.Element;
};

export default function OauthSignIn() {
  const oAuthProviders: OAuthProviders[] = [
    {
      name: "github",
      displayName: "GitHub",
      icon: <Github className="h-5 w-5" />,
    },
    /* Add desired OAuth providers here */
  ];
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (provider: string) => {
    setIsSubmitting(true); // Disable the button while the request is being handled
    await signInWithOAuth(provider);
    setIsSubmitting(false);
  };

  return (
    <div className="">
      <span className="block text-center mb-4">or</span>
      <span className="block text-center mb-4">Sign in with Oauth</span>
      {oAuthProviders.map((provider) => (
        <div key={provider.name}>
          <input type="hidden" name="provider" value={provider.name} />
          <Button
            key={provider.name}
            variant="default"
            type="submit"
            className="w-full"
            loading={isSubmitting}
            onSubmit={() => handleSubmit(provider.name)}
          >
            <span className="mr-2">{provider.icon}</span>
            <span>{provider.displayName}</span>
          </Button>
        </div>
      ))}
    </div>
  );
}
