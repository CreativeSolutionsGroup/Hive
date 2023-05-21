import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function Nav() {
  return (
    <AppBar>
      <Toolbar sx={{ height: "2rem" }}>
        <Link href={"/"} style={{ textDecoration: "none" }}><Typography variant="h6" sx={{ color: "white" }}>Hive</Typography></Link>
        <Box ml="auto">
          <Button variant="text" onClick={() => signOut()}><Typography color="white">Logout</Typography></Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}