import prisma from "@/lib/prisma";
import { Box, Card, CardContent, Link, Typography } from "@mui/material";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const { userId } = query as { userId: string };
  if (userId == null) return { redirect: { destination: "/", permanent: false } }
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    include: {
      socialMedia: true
    }
  });
  if (user == null) return { redirect: { destination: "/", permanent: false } }

  return {
    props: {
      user
    }
  }
}

export default function User({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h3" component="h1">{user.name}</Typography>
          {user.socialMedia.map(social => (
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