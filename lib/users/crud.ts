import prisma from "../prisma";

export const getStudent = async (id: string) => {
  return prisma.user.findUnique({
    where: {
      id
    },
    include: {
      socialMedia: true
    }
  });
};