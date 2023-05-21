import { Social, User } from "@prisma/client";

export type UserWithSocials = User & {
  socialMedia: Array<Social>
}