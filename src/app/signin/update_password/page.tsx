import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getRedirectMethod } from "@/utils/auth-helpers/settings";
import { Card } from "@/components/ui/card";
import UpdatePassword from "@/components/ui/auth-forms/update-password";

export default async function SignIn() {
  const redirectMethod = getRedirectMethod();

  // Check if the user is already logged in and redirect to the account page if so
  const supabase = createClient();
  const user = (await supabase.auth.getUser()).data.user;
  if (user === null) {
    return redirect("/signin");
  }

  return (
    <div className="flex justify-center height-screen-helper">
      <div className="flex flex-col justify-between max-w-lg p-3 m-auto w-96">
        <Card>
          <UpdatePassword redirectMethod={redirectMethod} />
        </Card>
      </div>
    </div>
  );
}
