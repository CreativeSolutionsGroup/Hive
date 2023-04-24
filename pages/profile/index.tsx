import { Alert, Button, Card, CardContent, Snackbar, TextField, Typography } from "@mui/material";
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Social, SocialType } from "@prisma/client";
import { useState } from "react";

export async function getServerSideProps({ req, res }: GetServerSidePropsContext) {
  const session = await getServerSession(req, res, authOptions);
  const user = await prisma.user.findUnique({
    where: {
      email: session!.user!.email!
    },
    include: {
      socialMedia: true
    }
  });
  if (user == null) return { redirect: { destination: "/", permanent: false } };

  return {
    props: {
      user
    }
  }
}

function SocialSetting({ social, onChange }: { social: Social, onChange: (_: string) => void }) {
  return (
    <>
      <Typography>{social.type}</Typography>
      <TextField onChange={e => onChange(e.target.value)} />
    </>
  )
}

export default function Profile({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [socials, setSocials] = useState(user.socialMedia);
  const [success, setSuccess] = useState(false);

  /**
   * Loops through each social media and saves it.
   * A wonderful part of Promise.all is that it atomically fails.
   */
  async function saveUserSocials() {
    try {
      await Promise.all(socials.map(async s => await fetch(`/api/social/${s.id}`, {
        method: "PUT",
        body: JSON.stringify(s),
        headers: {
          "content-type": "application/json"
        }
      })));
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
    const updated = { ...socials[i], href: s } as Social
    setSocials(l => [...l.slice(0, i), updated, ...l.slice(i + 1)]);
  }

  return (
    <>
      <Typography>Edit Profile</Typography>
      <Button LinkComponent={Link} href={`/sting/${user.stingGroupId}`}>Go to Sting Group</Button>
      <Card>
        <CardContent>
          <Typography>User Data</Typography>
          <TextField value={user?.name} disabled />
        </CardContent>
      </Card>
      <Card>
        <Typography>Social Media</Typography>
        {user.socialMedia.map((social, i) =>
          <SocialSetting key={social.id} social={social} onChange={s => updateSocial(i, s)} />)}
        <Button onClick={() => saveUserSocials()}>Save</Button>
      </Card>

      <Snackbar open={success} autoHideDuration={4000} onClose={() => setSuccess(false)}>
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ wdith: "100%" }}>
          Successfully Saved
        </Alert>
      </Snackbar>
    </>
  )
}