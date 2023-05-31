import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export const config = { matcher: ["/:path*"] };

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const url = req.nextUrl;

    if (req.url.match("http[s]?://.*/$")) {
      if (!req.nextauth.token?.groupId) {
        url.pathname = "/profile";
        return NextResponse.redirect(url);
      } else {
        url.pathname = `/sting/${req.nextauth.token?.groupId}`;
        return NextResponse.redirect(url);
      }
    }

    if (req.url.match("http[s]?://.*/sting/.*$")) {
      const { searchParams } = new URL(req.url);
      const stingId = searchParams.get("stingId");
      const [group] = stingId ? [stingId] : req.url.split("/").slice(-1);
      if (decodeURIComponent(group) !== req.nextauth.token?.groupId) {
        url.pathname = `/sting/${req.nextauth.token?.groupId}`;
        return NextResponse.redirect(url);
      }
    }

    if (req.url.match("http[s]?://.*/student/.*$")) {
      const { searchParams } = new URL(req.url);
      const user = searchParams.get("userId");
      const [userId] = user ? [user] : req.url.split("/").slice(-1);
      if (!req.nextauth.token?.accessibleUsers.find((v) => v === userId)) {
        url.pathname = "/";
        return NextResponse.redirect(url);
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);
