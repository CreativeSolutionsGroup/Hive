import { Box } from "@mui/material";
import Nav from "./Nav";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <Nav />
      <Box px={2} py={10}>
        {children}
      </Box>
    </main>
  );
}