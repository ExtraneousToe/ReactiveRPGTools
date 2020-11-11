import React from "react";

export const themes = Object.freeze({
  dark: {
    styleName: "night",
    navbarLightDark: { light: false, dark: true },
    navbarColour: "dark",
    navbarTextClass: "text-light",
  },
  light: {
    styleName: "",
    navbarLightDark: { light: true, dark: false },
    navbarColour: "light",
    navbarTextClass: "text-dark",
  },
});

export const AppTheme = React.createContext({
  theme: themes.dark,
  cycleTheme: (currentState) => {},
});

export default AppTheme;
