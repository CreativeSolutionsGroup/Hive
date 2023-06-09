import UserCard from "@/components/UserCard";
import prisma from "@/lib/prisma";
import HelpIcon from "@mui/icons-material/Help";
import CloseIcon from "@mui/icons-material/Close";
import {
  Alert,
  Box,
  Button,
  Card,
  IconButton,
  Modal,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { Social, SocialType } from "@prisma/client";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
import { useState } from "react";
import { authOptions } from "../api/auth/[...nextauth]";
import useUserSocials from "@/hooks/useUserSocials";

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext) {
  const session = await getServerSession(req, res, authOptions);
  const user = await prisma.user.findUnique({
    where: {
      email: session!.user!.email!,
    },
    include: {
      socialMedia: true,
    },
  });
  if (user == null) return { redirect: { destination: "/", permanent: false } };

  if (!user.stingGroupId) {
    const userMetadata = await prisma.studentMetadata.findFirst({
      where: { email: user.email ?? "" },
    });
    if (!userMetadata)
      return { redirect: { destination: "/", permanent: false } };

    return {
      props: {
        user: await prisma.user.update({
          where: { id: user.id },
          data: {
            group: {
              connect: {
                // We assume that sting group ID is not null for any of the students
                id: userMetadata.stingGroupId!,
              },
            },
            socialMedia: {
              createMany: {
                data: [
                  { href: "", type: SocialType.Instagram },
                  { href: "", type: SocialType.Twitter },
                  { href: "", type: SocialType.Facebook },
                ],
              },
            },
          },
          include: {
            socialMedia: true,
          },
        }),
      },
    };
  }

  return {
    props: {
      user,
    },
  };
}

export default function Profile({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [socials, setSocial] = useUserSocials(user.socialMedia);
  const [valid, setValid] = useState(user.socialMedia.map(() => true));
  const [success, setSuccess] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const handleClose = () => setHelpOpen(false);
  const handleOpen = () => setHelpOpen(true);

  /**
   * Loops through each social media and saves it.
   * A wonderful part of Promise.all is that it atomically fails.
   */
  async function saveUserSocials() {
    try {
      await Promise.all(
        socials.map(
          async (s, i) =>
            valid[i] &&
            (await fetch(`/api/social/${s.id}`, {
              method: "PUT",
              body: JSON.stringify(s),
              headers: {
                "content-type": "application/json",
              },
            }))
        )
      );
      setSuccess(true);
    } catch (e) {
      setSuccess(false);
    }
  }

  /**
   * Updates a social media href at index i
   * @param i The index to update as
   * @param s The href of the social media
   */
  async function updateSocial(i: number, s: string) {
    const updated = { ...socials[i], href: s } as Social;
    let socialValid = false;
    if (updated.type === "Twitter") {
      socialValid = !!s.match(
        "^(([Hh][Tt]{2}[Pp][Ss]?:\\/\\/)?([Ww]{3}\\.)?([Tt][Ww][Ii][Tt]{2}[Ee][Rr])\\.com\\/(?!([Tt][Ww][Ii][Tt]{2}[Ee][Rr])|[Aa][Dd][Mm][Ii][Nn])[a-zA-Z0-9_]{4,15}){0,1}$"
      );
      updateValid(i, socialValid);
    } else if (updated.type === "Facebook") {
      socialValid = !!s.match(
        "^(([Hh][Tt]{2}[Pp][Ss]?:\\/\\/)?([Ww]{3}\\.)?([Ff][Aa][Cc][Ee][Bb][Oo]{2}[Kk])\\.com\\/profile\\.php\\?id=[0-9]+){0,1}$"
      );
      updateValid(i, socialValid);
    } else {
      socialValid = !!s.match(
        "^(([Hh][Tt]{2}[Pp][Ss]?:\\/\\/)?([Ww]{3}\\.)?([Ii][Nn][Ss][Tt][Aa][Gg][Rr][Aa][Mm])\\.com\\/[a-zA-Z0-9\\.]{1,30}){0,1}$"
      );
      updateValid(i, socialValid);
    }

    setSocial(updated, i);
  }

  function updateValid(i: number, b: boolean) {
    setValid([...valid.slice(0, i), b, ...valid.slice(i + 1)]);
  }

  return (
    <>
      <Modal open={helpOpen} onClose={handleClose}>
        <Box display={"flex"} height={"100%"}>
          <Box
            display={"flex"}
            flexDirection={"column"}
            sx={{ backgroundColor: "white" }}
            marginX={"auto"}
            marginY={"auto"}
            borderRadius={"10px"}
            minWidth={"400px"}
          >
            <Box display={"flex"}>
              <Typography variant="h6" margin={2} flexGrow={1}>
                Getting Social Links
              </Typography>
              <IconButton
                sx={{
                  width: "35px",
                  height: "35px",
                  marginY: "auto",
                  marginRight: 1,
                }}
                onClick={handleClose}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <Box borderTop={"2px solid darkgray"} marginX={1} paddingBottom={3}>
              <Typography marginX={1} marginTop={2}>
                Instructions go here...
              </Typography>
            </Box>
          </Box>
        </Box>
      </Modal>
      <Box
        sx={{
          width: { xs: "90%", sm: "400px" },
          position: "relative",
        }}
      >
        <Typography variant="subtitle1" fontWeight={700}>
          Profile for {user.name}
        </Typography>
        <UserCard user={user} />
        <Card
          sx={{
            padding: "1rem",
          }}
        >
          <Box display={"flex"} flexDirection={"column"}>
            <Typography variant="h6" mb={1}>
              Social Media
            </Typography>
            <Box display={"flex"} flexDirection={"column"}>
              {socials.map((v, i) => (
                <TextField
                  key={i}
                  label={`${v.type} Profile URL`}
                  helperText={!valid[i] ? "Invalid URL" : ""}
                  error={!valid[i]}
                  value={v.href}
                  onChange={(e) => updateSocial(i, e.target.value)}
                  sx={{ margin: 1 }}
                />
              ))}
              <Button
                onClick={saveUserSocials}
                sx={{ width: "150px", margin: 1, marginLeft: "auto" }}
                variant="contained"
              >
                Save
              </Button>
            </Box>
          </Box>
        </Card>
        <Button
          LinkComponent={Link}
          href={`/sting/${user.stingGroupId}`}
          variant="contained"
          sx={{ marginTop: 2 }}
        >
          Go to Sting Group
        </Button>

        <Snackbar
          open={success}
          autoHideDuration={4000}
          onClose={() => setSuccess(false)}
        >
          <Alert
            onClose={() => setSuccess(false)}
            severity="success"
            sx={{ wdith: "100%" }}
          >
            Successfully Saved
          </Alert>
        </Snackbar>
        <IconButton
          sx={{
            position: "absolute",
            right: "0px",
            bottom: "-10px",
          }}
          onClick={handleOpen}
        >
          <HelpIcon
            sx={{
              backgroundColor: "#fdb813",
              borderRadius: "50%",
              color: "#003865",
              width: "40px",
              height: "40px",
              boxShadow: 3,
            }}
          />
        </IconButton>
      </Box>
    </>
  );
}
