import { UserWithSocials } from "@/types/user";
import { Card, CardContent, Typography, Box } from "@mui/material";
import Link from "next/link";

export default function UserCard({ user }: { user: UserWithSocials }) {
  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h5" component="h1">
          {user.name}
        </Typography>
        {user.socialMedia.map((social) => (
          <Box key={social.id}>
            <Typography>
              {!social.href || social.href === "" ? (
                `No link provided for ${social.type}`
              ) : (
                <Link
                  href={
                    social.href.includes("http")
                      ? social.href
                      : `https://${social.href}`
                  }
                >
                  {social.type}
                </Link>
              )}
            </Typography>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
}
