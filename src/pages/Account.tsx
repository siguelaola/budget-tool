import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { NextPage } from "next";
import { supabase } from "../../utils";

const Account: NextPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-background">
    <div className="max-w-screen-lg w-full mx-4 bg-white rounded-lg shadow-lg p-8 overflow-y-scroll">
      <Auth
        supabaseClient={supabase}
        providers={["google", "facebook", "twitter"]}
        appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'rgb(23, 0, 70)',
                  brandAccent: 'rgb(23, 0, 70)'
                },
              },
            },
          }}
      />
    </div>
  </div>
);

export default Account;
