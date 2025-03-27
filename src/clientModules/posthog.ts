// @ts-expect-error
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";
import Cookies from "js-cookie";
import posthog from "posthog-js";

// WARNING: These cookies are used by the app. Make sure you consider both when making changes.
export const ESSENTIAL_COOKIES = "essential-cookies";
export const NON_ESSENTIAL_COOKIES = "non-essential-cookies";

export const getEssentialCookies = () => {
  return Cookies.get(ESSENTIAL_COOKIES) === "true";
};

export const getNonEssentialCookies = () => {
  return Cookies.get(NON_ESSENTIAL_COOKIES) === "true";
};

if (ExecutionEnvironment.canUseDOM) {
  posthog.init(
    process.env.PUBLIC_POSTHOG_KEY ??
      "phc_QHjx4dKKNAqmLS1U64kIXo4NlYOGIFDgB1qYxw3wh1W", // dev posthog token
    {
      persistence: getNonEssentialCookies() ? "localStorage+cookie" : "memory",
      cross_subdomain_cookie: true,
      api_host: "https://eu.i.posthog.com",
      ui_host: "https://eu.posthog.com",
      capture_pageview: false, // Disable automatic pageview capture, as we capture manually below
    },
  );
}

export const onRouteUpdate = ({ location, previousLocation }) => {
  if (!ExecutionEnvironment.canUseDOM) return;
  if (location.pathname != previousLocation?.pathname) {
    posthog.capture("$pageview");
  }
};
