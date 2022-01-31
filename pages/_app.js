import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import { registerSW } from "../lib/sw.utils";

import "../styles/global.css";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  useEffect(() => {
    //registerSW();
  }, []);

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
