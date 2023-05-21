import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { Social } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function SocialHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (session?.user == null) return res.status(401).end();

  const { id } = req.query as { id: string | null };
  if (id == null) return res.status(400).end("Send id along with request.");

  // update a social media by ID
  // we prefer to update social medias apart from their user.
  if (req.method === "PUT") {
    const body = req.body as Social;

    const socials = await prisma.social.findMany({
      where: {
        user: {
          email: session.user.email,
        },
      },
    });

    // if the user doesn't have this social, don't allow.
    // prevents user from assigning other people social medias
    if (socials.findIndex((f) => f.id === id) == null)
      return res.status(403).end();

    // we don't want to let the user update *everything* about the social
    // like, you shouldn't be able to reassign the social to another user.
    const updatedSocial = await prisma.social.update({
      where: {
        id,
      },
      data: {
        href: body.href,
      },
    });

    return res.json(updatedSocial);
  }

  return res.status(405).end();
}
