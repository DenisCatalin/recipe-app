"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { Provider as ReduxProvider } from "react-redux";
import StyledComponentsRegistry from "./registry";
import { lightTheme, darkTheme } from "./styles/theme";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { store } from "./store/store";

function StyledThemeWrapper({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? (resolvedTheme === "dark" ? darkTheme : lightTheme) : lightTheme;

  return <StyledThemeProvider theme={currentTheme}>{children}</StyledThemeProvider>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <StyledComponentsRegistry>
        <NextThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <StyledThemeWrapper>{children}</StyledThemeWrapper>
        </NextThemeProvider>
      </StyledComponentsRegistry>
    </ReduxProvider>
  );
}
