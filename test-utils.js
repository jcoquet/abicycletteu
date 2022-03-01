import React from "react";
import { render as rtlRender } from "@testing-library/react";
import { Provider } from "overmind-react";
import { SessionProvider } from "next-auth/react";
import { createOvermind } from "overmind";
import _ from "lodash";
import { SWRConfig } from "swr";

import { config } from "./overmind";

const fakeSessionData = {
  sid: "sid",
  synotoken: "synotoken",
  domain: "toto",
};

function render(ui, defaultState = {}) {
  const overmind = createOvermind(_.merge({}, config, { state: defaultState }));
  function Wrapper({ children }) {
    return (
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <SessionProvider session={fakeSessionData}>
          <Provider value={overmind}>{children}</Provider>
        </SessionProvider>
      </SWRConfig>
    );
  }
  return rtlRender(ui, { wrapper: Wrapper });
}

// re-export everything
export * from "@testing-library/react";
// override render method
export { render };
