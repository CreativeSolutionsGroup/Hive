import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { signOut } from "next-auth/react";

export default function Nav() {
  return (
    <AppBar>
      <Toolbar>
        <Typography variant="h6">Hive</Typography>
        <Box ml="auto">
          <Button variant="text" onClick={() => signOut()}><Typography color="white">Logout</Typography></Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}