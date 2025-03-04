// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
import { themes } from "prism-react-renderer";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Portia AI Docs",
  tagline: "Portia AI Technical Documentation",
  favicon: "img/Logo_Portia_Symbol_Black.png",

  staticDirectories: ["static"],

  // Set the production url of your site here
  url: `https://docs.portialabs.ai`,
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: "/",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  plugins: [require.resolve("docusaurus-lunr-search")],

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        pages: {
          path: "src/pages",
          routeBasePath: "",
          include: ["**/*.{js,jsx,ts,tsx,md,mdx}"],
          exclude: [
            "**/_*.{js,jsx,ts,tsx,md,mdx}",
            "**/_*/**",
            "**/*.test.{js,jsx,ts,tsx}",
            "**/__tests__/**",
          ],
          mdxPageComponent: "@theme/MDXPage",

          rehypePlugins: [],
          beforeDefaultRemarkPlugins: [],
          beforeDefaultRehypePlugins: [],
        },
        docs: {
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
          sidebarCollapsed: false,
          exclude: [
            // todo richard, command to prove this is ok
            "**/_*.{js,jsx,ts,tsx,md,mdx}",
            "**/_*/**",
            "**/*.test.{js,jsx,ts,tsx}",
            "**/__tests__/**",
            "**/__init__",
          ],
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  markdown: {
    mermaid: true,
  },

  themes: ["@docusaurus/theme-mermaid", "docusaurus-theme-redoc"],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        logo: {
          alt: "Portia Logo",
          src: "img/logo.png",
          srcDark: "img/Logo_Portia_Line_White.png",
        },
        items: [
          {
            label: "Docs",
            to: "/",
            // Don't show docs nav as active for portia-tools and sdk
            activeBaseRegex: "^(?!/portia-tools|/SDK).*$",
          },
          {
            label: "Tools", // Label for the dropdown
            position: "left", // or 'right'
          },
          {
            type: "docSidebar",
            sidebarId: "sdkSidebar",
            position: "left",
            label: "SDK",
          },
          {
            label: "REST API",
            to: "/examples/redoc/",
          },
          {
            href: "https://github.com/portiaAI/portia-sdk-python",
            className: "header-github-link",
            "aria-label": "GitHub repository",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        copyright: `Copyright © ${new Date().getFullYear()} Portia AI.`,
      },
      prism: {
        theme: themes.nightOwl,
        darkTheme: themes.nightOwlLight,
        additionalLanguages: ["python", "bash", "json"],
      },
    }),
};

module.exports = config;
