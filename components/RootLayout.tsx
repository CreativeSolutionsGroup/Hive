import { Box } from "@mui/material";
import Nav from "./Nav";
import cuBanner from "@/assets/cu-banner.png"
import Link from "next/link";
import Image from "next/image";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <Nav />
      <Box px={1.5} pt={10}>
        {children}
      </Box>
      <Box px={1.5} display="flex" flexDirection="column">
        <Box mb={5}>
          <Image src={cuBanner.src} alt="CU Banner" width={281} height={81} />
        </Box>

        <Link href="https://www.cedarville.edu/events/getting-started">Find More Information</Link>
      </Box>
    </main>
  )
}