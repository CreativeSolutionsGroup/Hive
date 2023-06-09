import { Social } from "@prisma/client";
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useState,
} from "react";

interface UserSocialContextType {
  socials: Array<Social>;
  setSocials: Dispatch<SetStateAction<Array<Social>>>;
}

export const UserSocialContext = createContext<UserSocialContextType>({
  socials: [],
  setSocials: () => {},
});

export function UserSocialProvider(props: PropsWithChildren) {
  const [socials, setSocials] = useState<Array<Social>>([]);

  return (
    <UserSocialContext.Provider value={{ socials, setSocials }} {...props} />
  );
}
