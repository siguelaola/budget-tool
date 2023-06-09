// import '@/styles/ @/components/ @/interfaces/styles/globals.css'
import type { AppProps } from "next/app";
import "../styles/globals.css";
import { useState, useEffect } from "react";
import Incomes from "./incomes";
import Home from ".";
import Account from "./Account";
import { supabase } from "../../utils";

import { UserDataProvider } from "../components/UserDataProvider";

export default function App({ Component, pageProps }: AppProps) {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <UserDataProvider {...pageProps}>
      {!session ? (
        <Account {...pageProps} />
      ) : 
      Component !== Home && Component !== Account ? (
        <Component session={session} {...pageProps} />
      ) : (
        <Incomes session={session} {...pageProps} />
      )}
    </UserDataProvider>
  );
}
