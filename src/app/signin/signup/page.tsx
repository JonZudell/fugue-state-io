import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getRedirectMethod } from "@/utils/auth-helpers/settings";
import { Card } from "@/components/ui/card";
import SignUp from "@/components/ui/auth-forms/signup";

export default async function SignIn() {
  const redirectMethod = getRedirectMethod();

  // Check if the user is already logged in and redirect to the account page if so
  const supabase = createClient();
  const user = (await supabase.auth.getUser()).data.user;
  if (user !== null) {
    return redirect("/");
  }

  return (
    <div className="flex justify-center height-screen-helper">
      <div className="flex flex-col justify-between max-w-lg p-3 m-auto w-96">
        <Card>
          <SignUp redirectMethod={redirectMethod} />
        </Card>
      </div>
    </div>
  );
}
