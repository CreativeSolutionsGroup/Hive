import gmail from "@/assets/gmail.png";
import instagram from "@/assets/socials/CU Social Icon_Instagram_color.svg";
import tiktok from "@/assets/socials/CU Social Icon_TikTok_color.svg";
import twitter from "@/assets/socials/CU Social Icon_Twitter_color.svg";
import facebook from "@/assets/socials/CU Social Icon_facebook_color.svg";
import useUserSocials from "@/hooks/useUserSocials";
import { UserWithSocials } from "@/types/user";
import { Avatar, Box, Card, Typography } from "@mui/material";
import { SocialType } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const socialToHref: { [key in SocialType]: string } = {
  Instagram: "https://instagram.com/",
  Facebook: "https://facebook.com/",
  Twitter: "https://twitter.com/",
  Tiktok: "https://tiktok.com/@",
};

export default function UserCard({ user }: { user: UserWithSocials }) {
  const { data: session } = useSession();
  const [user_socials] =
    session?.user?.email === user.email
      ? useUserSocials(user.socialMedia)
      : [user.socialMedia.sort((a, b) => a.type.localeCompare(b.type))];

  if (session?.user == null) return <></>;

  return (
    <Card
      sx={{
        marginBottom: 2,
        paddingX: 0.1,
        flex: 1,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box display="flex" flexGrow={1} my={2} flexDirection="column">
        <Box display="flex" justifyContent="space-between">
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{
              textDecoration: "none",
              marginX: 2,
              marginY: "auto",
              color: "black",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
          >
            {user.name}
          </Typography>
          {user.leader && (
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{
                textDecoration: "none",
                marginX: 2,
                marginY: "auto",
                opacity: "50%",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              STING Leader
            </Typography>
          )}
        </Box>

        <Box mt={1} flexGrow={1} display={"flex"} marginRight={3}>
          <Box my="auto" mx={2}>
            <Link href={`mailto:${user.email}`}>
              <Avatar
                sx={{
                  backgroundColor: "#0000",
                  overflow: "visible",
                  width: "30px",
                  height: "30px",
                }}
              >
                <Image
                  alt="social logo"
                  src={gmail.src}
                  fill
                  style={{
                    objectFit: "contain",
                  }}
                />
              </Avatar>
            </Link>
          </Box>

          {user_socials.map((social, i) =>
            social.href.length === 0 ? (
              <Avatar
                sx={{
                  backgroundColor: "#0000",
                }}
                key={social.id}
              >
                <Box></Box>
              </Avatar>
            ) : (
              <Box key={social.id} my={"auto"} mx={2}>
                <Link href={`${socialToHref[social.type]}${social.href}`}>
                  <Avatar
                    sx={{
                      backgroundColor: "#0000",
                      overflow: "visible",
                      width: "30px",
                      height: "30px",
                    }}
                  >
                    <Image
                      alt="social logo"
                      src={
                        social.type === "Facebook"
                          ? facebook.src
                          : social.type === "Instagram"
                          ? instagram.src
                          : social.type === "Twitter"
                          ? twitter.src
                          : tiktok.src
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
