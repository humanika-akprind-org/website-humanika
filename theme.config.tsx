import React from "react";

const config = {
  logo: <span>HUMANIKA</span>,
  project: {
    link: "https://github.com/shuding/nextra/tree/main/docs",
  },
  docsRepositoryBase: "https://github.com/shuding/nextra/tree/main/docs",
  footer: {
    text: "HUMANIKA Documentation",
  },
  sidebar: {
    autoCollapse: true,
  },
  themeSwitch: {
    useOptions() {
      return {
        light: "Light",
        dark: "Dark",
        system: "System",
      };
    },
  },
  primaryHue: 210,
  primarySaturation: 100,
};

export default config;
