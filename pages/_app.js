import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import { Provider } from "overmind-react";
import { createOvermind } from "overmind";

import "semantic-ui-css/semantic.min.css";
// import { registerSW } from "../lib/sw.utils";
import { config } from "../overmind";

import "../styles/global.css";

const overmind = createOvermind(config);

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  useEffect(() => {
    //registerSW();
  }, []);

  return (
    <SessionProvider session={session}>
      <Provider value={overmind}>
        <Component {...pageProps} />
      </Provider>
    </SessionProvider>
  );
}
