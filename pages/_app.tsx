import "@/styles/globals.css";
import type { AppProps } from "next/app";
import CssBaseline from "@mui/material/CssBaseline";
import { SessionProvider } from "next-auth/react";
import RootLayout from "@/components/RootLayout";

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <CssBaseline />
      <RootLayout>
        <Component {...pageProps} />
      </RootLayout>
    </SessionProvider>
  );
}
