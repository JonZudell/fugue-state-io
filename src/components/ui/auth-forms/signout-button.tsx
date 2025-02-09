"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";

export default function SignOutButton() {
  const supabase = createClientComponentClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    redirect("/signin");
  };

  return (
    <button
      onClick={handleSignOut}
      className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700"
    >
      Sign Out
    </button>
  );
}
