import { Box, Card, CardContent, Typography } from "@mui/material";
import {
  GetStaticPropsContext, InferGetServerSidePropsType,
} from "next";
import prisma from "@/lib/prisma";
import { Social, StingGroup, User } from "@prisma/client";
import { getStingGroup } from "@/lib/groups";
import UserCard from "@/components/UserCard";

export async function getServerSideProps({ params }: GetStaticPropsContext) {
  if (!params) throw new Error("No path parameters found");
  const stingGroup = await getStingGroup((params.stingId as string) ?? "");
  if (!stingGroup) return { notFound: true };

  const unregisteredUsers = await prisma.studentMetadata.findMany({
    where: {
      stingGroupId: stingGroup.id
    }
  });

  const users = stingGroup.users;
  let uEmails = users?.map(u => u.email) ?? [];

  const mappedUsers =
    unregisteredUsers?.map(u =>
    ({
      email: u.email,
      id: u.id,
      name: u.name,
      redwoodId: u.id,
      socialMedia: []
    })).filter(u => !uEmails.includes(u.email)) as any as Array<User & { socialMedia: Array<Social> }> ?? []
  const allUsers = users.concat(mappedUsers);

  return {
    props: { stingGroup, users: allUsers },
  };
}

export default function Sting({
  stingGroup,
  users
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Typography fontWeight={"800"} variant="h4" component="h1">
        {stingGroup?.id}
      </Typography>
      <Box mt={3}>
        {users.map((m, i) => (
          <UserCard user={m} key={i} />
        ))}
      </Box>
    </>
  );
}
