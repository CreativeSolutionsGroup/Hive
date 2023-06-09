import { Social, StingGroup, User } from "@prisma/client";

export type StingWithUserSocials = StingGroup & {
  users: Array<
    User & {
      socialMedia: Array<Social>;
    }
  >;
};
