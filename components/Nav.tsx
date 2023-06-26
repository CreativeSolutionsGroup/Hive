import welcomeHome from "@/assets/welcome-home.png";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Nav() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<null | HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { data: session } = useSession();

  const profileLoader = ({ src }: { src: string }) => src;

  return (
    <AppBar>
      <Toolbar sx={{ height: "2rem" }}>
        <Box>
          <Image
            src={welcomeHome.src}
            alt="Welcome Home"
            height={50}
            width={100}
          />
        </Box>
        <Box ml="auto">
          <IconButton size="medium" onClick={handleClick}>
            <Avatar>
              <Image
                alt="profile picture"
                src={session?.user?.image ?? "https://fakeimg.pl/32x32?text=+"}
                loader={profileLoader}
                fill
                referrerPolicy="no-referrer"
                style={{ objectFit: "contain" }}
              />
            </Avatar>
          </IconButton>
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
        >
          <MenuItem onClick={handleClose}>
            <Link
              href={"/profile"}
              style={{
                textDecoration: "none",
                color: "black",
                display: "flex",
              }}
            >
              <AccountCircleIcon sx={{ mr: 2, color: "#fdb813" }} />
              <Typography color={"#003865"}>Profile</Typography>
            </Link>
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose();
              signOut();
            }}
          >
            <LogoutIcon sx={{ mr: 2, color: "#fdb813" }} />
            <Typography color={"#003865"}>Log out</Typography>
          </MenuItem>
          <MenuItem
            onClick={() => {
              signIn();
            }}
          >
            <PersonAddIcon sx={{ mr: 2, color: "#fdb813" }} />
            <Typography color={"#003865"}>Add account</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
