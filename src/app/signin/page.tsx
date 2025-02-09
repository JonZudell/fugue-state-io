import { getRedirectMethod } from "@/utils/auth-helpers/settings";
import { Card } from "@/components/ui/card";
import PasswordSignIn from "@/components/ui/auth-forms/password-signin";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const redirectMethod = getRedirectMethod();
  const supabase = createClient();
  const user = (await supabase.auth.getUser()).data.user;
  console.log(user);
  if (user !== null) {
    return redirect("/");
  }
  return (
    <div className="flex justify-center height-screen-helper">
      <div className="flex flex-col justify-between max-w-lg p-3 m-auto w-96">
        <Card>
          <PasswordSignIn redirectMethod={redirectMethod} />
        </Card>
      </div>
    </div>
  );
}
