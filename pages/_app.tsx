import RootLayout from "@/components/RootLayout";
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
      main: "#015289",
    },
    secondary: {
      main: "#fdb813",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: "#003865",
        },
      },
    },
  },
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RootLayout>
          <Component {...pageProps} />
        </RootLayout>
      </ThemeProvider>
    </SessionProvider>
  );
}
