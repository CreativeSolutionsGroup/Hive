import { UserWithSocials } from "@/types/user";
import { Card, CardContent, Typography, Box, Avatar } from "@mui/material";
import Link from "next/link";
import facebook from "@/assets/facebook.png";
import instagram from "@/assets/instagram.png";
import twitter from "@/assets/twitter.png";
import Image from "next/image";
import { useState } from "react";
import useUserSocials from "@/hooks/useUserSocials";
import { useSession } from "next-auth/react";

export default function UserCard({ user }: { user: UserWithSocials }) {
  const { data: session } = useSession();
  const [socials] =
    session?.user && session.user.email == user.email
      ? useUserSocials(user.socialMedia)
      : [user.socialMedia.sort((a, b) => a.type.localeCompare(b.type))];

  return (
    <Card
      sx={{
        marginBottom: 2,
        backgroundColor: "#eee",
        paddingX: 2,
        width: {
          xs: "90%",
          sm: "400px",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            textDecoration: "none",
            marginX: 2,
            marginY: "auto",
            color: "black",
            flexGrow: 1,
            flexBasis: 0,
          }}
        >
          {user.name}
        </Typography>
        <Box
          flexGrow={1}
          flexBasis={0}
          display={"flex"}
          flexDirection={"row-reverse"}
          marginRight={3}
        >
          {socials.map((social, i) =>
            social.href.length === 0 ? (
              <Avatar
                sx={{
                  backgroundColor: "#0000",
                  marginX: 2,
                  width: "25px",
                  height: "25px",
                }}
                key={social.id}
              >
                <Box></Box>
              </Avatar>
            ) : (
              <Box key={social.id} my={"auto"} mx={2}>
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
                  <Avatar
                    sx={{
                      backgroundColor: "#0000",
                      overflow: "visible",
                      width: "25px",
                      height: "25px",
                    }}
                  >
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
            )
          )}
        </Box>
      </Box>
    </Card>
  );
}
