import { Box, Typography } from "@mui/material";

export default function ErrorPage() {
  return (
    <Box height={"50vh"} display={"flex"}>
      <Box mx={"auto"} my={"auto"}>
        <Typography variant="h4" textAlign={"center"}>
          403 | Unauthorized
        </Typography>
        <Typography maxWidth={"400px"} textAlign={"center"}>
          If you believe that you should have access to this page please contact
          your STING leader.
        </Typography>
      </Box>
    </Box>
  );
}
