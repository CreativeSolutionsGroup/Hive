import RootLayout from "@/components/RootLayout";
import { UserSocialProvider } from "@/contexts/UserSocialContext";
import "@/styles/globals.css";
import { ThemeProvider, createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeOptions } from "@mui/material/styles";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "rgb(0, 82, 136)",
    },
    secondary: {
      main: "rgb(253, 185, 19)",
    },
  },
  components: {
  },
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider theme={theme}>
        <UserSocialProvider>
          <CssBaseline />
          <RootLayout>
            {/* @ts-ignore */}
            <Component {...pageProps} />
          </RootLayout>
        </UserSocialProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
