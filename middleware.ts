import getSession from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

interface Routes {
  [key: string]: boolean;
}

const publicOnlyUrls: Routes = {
  "/": true,
  "/login": true,
  "/register": true,
};

export const middleware = async (req: NextRequest) => {
  const { id } = await getSession();
  const found = publicOnlyUrls[req.nextUrl.pathname];
  if (!id) {
    if (!found) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  } else {
    if (found) {
      return NextResponse.redirect(new URL("/profile", req.url));
    }
  }
};

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
