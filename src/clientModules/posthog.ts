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
console.log("zzz token", process.env.PUBLIC_POSTHOG_KEY);
posthog.init(
  process.env.PUBLIC_POSTHOG_KEY ??
    "phc_QHjx4dKKNAqmLS1U64kIXo4NlYOGIFDgB1qYxw3wh1W", // dev posthog token
  {
    persistence: getNonEssentialCookies() ? "localStorage+cookie" : "memory",
    cross_subdomain_cookie: true,
    api_host: "https://eu.i.posthog.com",
    ui_host: "https://eu.posthog.com",
  },
);

console.log("zzz client module loaded");
