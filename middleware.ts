import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";

const publicRoutes = [
  { path: "/sign-in", whenAuthenticated: "redirect" },
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED = "/sign-in";

export default function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicRoute = publicRoutes.find((route) => route.path === path);
  const authToken = request.cookies.get("authToken")?.value;

  const isValidToken = authToken;

  if (!isValidToken && publicRoute) {
    return NextResponse.next();
  }

  if (!isValidToken && !publicRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED;

    if (authToken) {
      const response = NextResponse.redirect(redirectUrl);
      response.cookies.delete("authToken");
      return response;
    }

    return NextResponse.redirect(redirectUrl);
  }

  if (
    isValidToken &&
    publicRoute &&
    publicRoute.whenAuthenticated === "redirect"
  ) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/";
    return NextResponse.redirect(redirectUrl);
  }

  if (isValidToken && !publicRoute) {
    return NextResponse.next();
  }
}

export const config: MiddlewareConfig = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
