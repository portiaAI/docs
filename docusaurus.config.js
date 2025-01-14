// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
import {themes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Portia AI Docs",
  tagline: "Portia AI Technical Documentation",
  favicon: "img/Logo_Portia_Symbol_Black.png",

  // Set the production url of your site here
  url: `https://app.porita.dev`,
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
            // '**/_*.{js,jsx,ts,tsx,md,mdx}',
            // '**/_*/**',
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
          srcDark: "img/Logo_Portia_Line_White.png"
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "productSidebar",
            position: "left",
            label: "Product",
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
