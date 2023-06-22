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

  return {
    props: {
      user,
    },
  };
}

export default function Profile({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {

  const [socials, setSocial] = useUserSocials(user?.socialMedia ?? []);
  const [success, setSuccess] = useState(false);

  if (user == null) return <></>;

  /**
   * Loops through each social media and saves it.
   * A wonderful part of Promise.all is that it atomically fails.
   */
  async function saveUserSocials() {
    try {
      await Promise.all(
        socials.map(
          async (s, i) =>
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

    setSocial(updated, i);
  }

  return (
    <>
      <Box>
        <Typography mb={5} variant="h4" fontWeight={800}>
          {user.name}
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
                  label={`${v.type} Username`}
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
      </Box>
    </>
  );
}
