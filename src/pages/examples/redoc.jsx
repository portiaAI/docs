import React from "react";
import ApiDoc from "@theme/ApiDoc";
import BrowserOnly from "@docusaurus/BrowserOnly";

// ClientOnly is a client side rendered redoc
function ClientOnly() {
  const get_redoc_url = (current_url) => {
    return "https://holsten-37277605247.us-central1.run.app/swagger/?format=openapi";
  };
  return (
    <BrowserOnly>
      {() => (
        <ApiDoc
          layoutProps={{
            title: `Portia API Reference`,
            description: "Overview of the Portia API",
          }}
          specProps={{
            url: get_redoc_url(window.location.href),
            optionsOverrides: {
              theme: {
                colors: {
                  primary: {
                    main: "#E6A63E",
                    light: "#1E1D1D",
                    dark: "#F1F6FF",
                  },
                },
              },
            },
          }}
        />
      )}
    </BrowserOnly>
  );
}

export default ClientOnly;
