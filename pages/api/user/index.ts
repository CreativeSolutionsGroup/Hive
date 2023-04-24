import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { page } = req.query as { page: string | undefined };

  if (req.method === "GET") {
    if (page == null) return res.status(400).end();
    const users = await prisma.user.findMany({
      skip: +page * 100,
      take: 100,
      include: {
        group: true
      },
      orderBy: {
        stingGroupId: "asc"
      }
    });

    return res.status(200).json(users);
  } 

  return res.status(405).end();
}