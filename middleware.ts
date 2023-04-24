import { NextRequestWithAuth, withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export const config = { matcher: ["/:path*"] }

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const url = req.nextUrl;

    if (req.url.match("http[s]?://.*/$")) {
      url.pathname = "/profile";
      return NextResponse.redirect(url);
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => !!token,
    },
  }
)