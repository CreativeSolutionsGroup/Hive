import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Social, SocialType } from "@prisma/client";
import { useEffect, useState } from "react";

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

  if (!user.redwoodId) {
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
            redwoodId: userMetadata.redwoodId,
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
  const [socials, setSocials] = useState(user.socialMedia);
  const [valid, setValid] = useState(user.socialMedia.map(() => true));
  const [success, setSuccess] = useState(false);

  /**
   * Loops through each social media and saves it.
   * A wonderful part of Promise.all is that it atomically fails.
   */
  async function saveUserSocials() {
    try {
      await Promise.all(
        socials.map(
          async (s) =>
            await fetch(`/api/social/${s.id}`, {
              method: "PUT",
              body: JSON.stringify(s),
              headers: {
                "content-type": "application/json",
              },
            })
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
    if (updated.type === "Twitter") {
      updateValid(
        i,
        !!s.match(
          "^([Hh][Tt]{2}[Pp][Ss]?:\\/\\/)?([Ww]{3}\\.)?([Tt][Ww][Ii][Tt]{2}[Ee][Rr])\\.com\\/(?!([Tt][Ww][Ii][Tt]{2}[Ee][Rr])|[Aa][Dd][Mm][Ii][Nn])[a-zA-Z0-9_]{4,15}$"
        )
      );
    } else if (updated.type === "Facebook") {
      updateValid(
        i,
        !!s.match(
          "^([Hh][Tt]{2}[Pp][Ss]?:\\/\\/)?([Ww]{3}\\.)?([Ff][Aa][Cc][Ee][Bb][Oo]{2}[Kk])\\.com\\/profile\\.php\\?id=[0-9]+$"
        )
      );
    } else {
      updateValid(
        i,
        !!s.match(
          "^([Hh][Tt]{2}[Pp][Ss]?:\\/\\/)?([Ww]{3}\\.)?([Ii][Nn][Ss][Tt][Aa][Gg][Rr][Aa][Mm])\\.com\\/[a-zA-Z0-9\\.]{1,30}$"
        )
      );
    }
    setSocials((l) => [...l.slice(0, i), updated, ...l.slice(i + 1)]);
  }

  function updateValid(i: number, b: boolean) {
    setValid([...valid.slice(0, i), b, ...valid.slice(i + 1)]);
  }

  return (
    <>
      <Typography>Edit Profile</Typography>
      <Button LinkComponent={Link} href={`/sting/${user.stingGroupId}`}>
        Go to Sting Group
      </Button>
      <Card>
        <CardContent>
          <Typography>User Data</Typography>
          <TextField value={user?.name} disabled />
        </CardContent>
      </Card>
      <Card sx={{ padding: "1rem" }}>
        <Box display={"flex"} flexDirection={"column"}>
          <Typography variant="h5" mb={1}>
            Social Media
          </Typography>
          {socials.map((v, i) => (
            <TextField
              key={i}
              label={`${v.type} Profile URL`}
              helperText={!valid[i] ? "Invalid URL" : ""}
              error={!valid[i]}
              value={v.href}
              onChange={(e) => updateSocial(i, e.target.value)}
              sx={{ width: "300px", margin: 1 }}
            />
          ))}
          <Button onClick={saveUserSocials} sx={{ width: "300px", margin: 1 }}>
            Save
          </Button>
        </Box>
      </Card>

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
    </>
  );
}
