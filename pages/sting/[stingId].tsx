import { testSting } from "@/lib/data";
import { Card, CardContent, Typography } from "@mui/material";
import Link from "next/link";
import { GetServerSidePropsContext, GetServerSidePropsResult, InferGetServerSidePropsType } from "next";
import prisma from "@/lib/prisma";
import { StingGroup } from "@prisma/client";

export async function getServerSideProps({ query, res }: GetServerSidePropsContext) {
  const { stingId } = query as { stingId: string };
  if (stingId == null) return { redirect: { destination: "/", permanent: false } }
  const stingGroup = await prisma.stingGroup.findUnique({
    where: {
      id: stingId
    },
    include: {
      students: true
    }
  });
  if (stingGroup == null) return { redirect: { destination: "/", permanent: false } }

  return {
    props: {
      stingGroup
    }
  }
}

export default function Sting({ stingGroup }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Typography>{stingGroup.id}</Typography>
      {stingGroup.students.map((m, i) => (
        <Link key={i} href={`/student/${m.id}`}>
          <Card sx={{ mb: 1 }}>
            <CardContent>
              <Typography>{m.name}</Typography>
            </CardContent>
          </Card>
        </Link>
      ))}
    </>
  )
}