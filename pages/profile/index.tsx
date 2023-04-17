import { Card, CardContent, TextField, Typography } from "@mui/material";
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]";
import prisma from "@/lib/prisma";

export async function getServerSideProps({ req, res }: GetServerSidePropsContext) {
  const session = await getServerSession(req, res, authOptions);
  const user = await prisma.user.findUnique({
    where: {
      email: session!.user!.email!
    }
  });
  if (user == null) return { redirect: { destination: "/", permanent: false } };

  return {
    props: {
      user
    }
  }
}

export default function Profile({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Typography>Edit Profile</Typography>
      <Card>
        <CardContent>
          <TextField value={user?.name} disabled />
          
        </CardContent>
      </Card>
    </>
  )
}