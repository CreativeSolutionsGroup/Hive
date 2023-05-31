import { testSting } from "@/lib/data";
import { Box, Card, CardContent, Typography } from "@mui/material";
import Link from "next/link";
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import prisma from "@/lib/prisma";
import { StingGroup } from "@prisma/client";
import { getStingGroup } from "@/lib/groups";
import UserCard from "@/components/UserCard";

export async function getStaticPaths() {
  const groups = await prisma.stingGroup.findMany();

  return {
    paths: groups.map((g) => ({
      params: {
        stingId: g.id,
      },
    })),
    fallback: true,
  };
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  if (!params) throw new Error("No path parameters found");
  const stingGroup = await getStingGroup((params.stingId as string) ?? "");

  if (!stingGroup) return { notFound: true, revalidate: 10 };

  return {
    props: { stingGroup },
    revalidate: 60,
  };
}

export default function Sting({
  stingGroup,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Typography variant="h4" component="h1">
        {stingGroup?.id}
      </Typography>
      <Box mt={3}>
        {stingGroup?.users.map((m, i) => (
          <UserCard user={m} key={i} />
        ))}
      </Box>
    </>
  );
}
