import type { Theme } from "theme-ui";

const theme: Theme = {
  fonts: {
    body: "system-ui, sans-serif",
    heading: "sans-serif",
    monospace: "monospace",
  },
  colors: {
    background: "#fff",
    primary: "#000",
    secondary: "#888",
    tertiary: "#eee",
  },
  text: {
    default: {
      color: "primary",
      fontFamily: "body",
    },
    secondary: {
      color: "secondary",
      fontFamily: "body",
    },
    heading: {
      color: "primary",
      fontFamily: "heading",
      fontSize: 4,
      fontWeight: "bold",
    },
  },
  buttons: {
    primary: {
      color: "background",
      bg: "primary",
      "&:hover": {
        bg: "secondary",
      },
      "&:active": {
        bg: "tertiary",
      },
    },
    secondary: {
      color: "background",
      bg: "secondary",
    },
  },
};

export default theme;
