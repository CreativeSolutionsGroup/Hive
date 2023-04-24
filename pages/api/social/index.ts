import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function Social(req: NextApiRequest, res: NextApiResponse) {
  // create a social media.
  // not implemented
  if (req.method === "POST") {
  }

  return res.status(405).end();
}