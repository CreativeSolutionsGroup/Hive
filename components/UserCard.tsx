import { UserWithSocials } from "@/types/user";
import { Card, CardContent, Typography, Box, Avatar } from "@mui/material";
import Link from "next/link";
import facebook from "@/assets/facebook.png";
import instagram from "@/assets/instagram.png";
import twitter from "@/assets/twitter.png";
import Image from "next/image";

export default function UserCard({ user }: { user: UserWithSocials }) {
  return (
    <Card sx={{ marginBottom: 2, backgroundColor: "#eee" }}>
      <CardContent sx={{ display: "flex" }}>
        <Link
          href={`/student/${user.id}`}
          style={{
            textDecoration: "none",
            marginLeft: 2,
            marginRight: 2,
            marginTop: "auto",
            marginBottom: "auto",
            color: "black",
          }}
        >
          <Typography variant="subtitle1">
            {user.name}
          </Typography>
        </Link>
        {user.socialMedia.map((social) => (
          <Box
            key={social.id}
            my={"auto"}
            mx={2}
            sx={{
              filter: social.href === "" ? "grayscale(100%)" : "",
            }}
          >
            <Link
              href={
                social.href.includes("http")
                  ? social.href
                  : `https://${social.href}`
              }
              style={{
                marginLeft: 2,
                marginRight: 2,
              }}
            >
              <Avatar sx={{ backgroundColor: "#0000", overflow: "visible" }}>
                <Image
                  alt="social logo"
                  src={
                    social.type === "Facebook"
                      ? facebook.src
                      : social.type === "Instagram"
                      ? instagram.src
                      : twitter.src
                  }
                  fill
                  style={{
                    objectFit: "contain",
                  }}
                />
              </Avatar>
            </Link>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
}
