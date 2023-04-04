import prisma from "@/lib/prisma";
import { Box, Card, CardContent, Link, Typography } from "@mui/material";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const { studentId } = query as { studentId: string };
  if (studentId == null) return { redirect: { destination: "/", permanent: false } }
  const student = await prisma.student.findUnique({
    where: {
      id: studentId
    },
    include: {
      socialMedia: true
    }
  });
  if (student == null) return { redirect: { destination: "/", permanent: false } }

  return {
    props: {
      student
    }
  }
}

export default function User({ student }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Card>
        <CardContent>
          <Typography>{student.name}</Typography>
          {student.socialMedia.map(social => (
            <Box key={social.id}>
              <Typography>
                <Link href={social.href}>{social.type}</Link>
              </Typography>
            </Box>
          ))}
        </CardContent>
      </Card>
    </>
  )
}