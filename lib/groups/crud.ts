import prisma from "../prisma";

export const getStingGroup = async (id: string) => {
  return await prisma.stingGroup.findUnique({
    where: { id },
    include: { users: true }
  });
};