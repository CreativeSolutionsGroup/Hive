import { Box, Button } from "@mui/material";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <Box display={"flex"}>
      <Box height={"70vh"} mx={"auto"} display={"flex"}>
        <Button
          onClick={() => signIn("azure-ad")}
          variant="contained"
          sx={{ marginY: "auto" }}
        >
          Sign In
        </Button>
      </Box>
    </Box>
  );
}
