import { UserSocialContext } from "@/contexts/UserSocialContext";
import { Social } from "@prisma/client";
import { useContext } from "react";

export default function useUserSocials(
  initialSocials: Array<Social>
): [Array<Social>, (value: Social, index: number) => void] {
  const { socials, setSocials } = useContext(UserSocialContext);
  if (socials.length === 0) {
    setSocials(initialSocials.sort((a, b) => a.type.localeCompare(b.type)));
  }

  function updateSocial(value: Social, index: number) {
    setSocials([
      ...socials.slice(0, index),
      value,
      ...socials.slice(index + 1),
    ]);
  }

  return [socials, updateSocial];
}
