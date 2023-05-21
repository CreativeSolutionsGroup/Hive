import UserCard from "@/components/UserCard";
import prisma from "@/lib/prisma";
import { getStudent } from "@/lib/users";
import { Box, Card, CardContent, Link, Typography } from "@mui/material";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";

export async function getStaticPaths() {
  const students = await prisma.user.findMany();

  return {
    paths: students.map((s) => ({
      params: {
        userId: s.id,
      },
    })),
    fallback: true,
  };
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  if (!params) throw new Error("No path parameters found");
  const user = await getStudent((params.userId as string) ?? "");

  if (!user) return { notFound: true, revalidate: 10 };

  return {
    props: { user },
    revalidate: 60,
  };
}

export default function User({
  user,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  if (!user) return <></>;

  return <UserCard user={user} />;
}
