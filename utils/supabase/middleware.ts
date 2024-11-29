import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set(name, value, options);
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set(name, "", { ...options, maxAge: -1 });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id;

  const publicRoutes = ["/sign-in"];
  const webRoutes = ["/dashboard"];

  if (user && request.nextUrl.pathname === "/sign-in") {
     // Screen size-based redirection
  const userAgent = request.headers.get("user-agent") || "";
  const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
  const isTablet = /iPad|Tablet/i.test(userAgent);
  const isDesktop = !isMobile && !isTablet;

  // if (request.nextUrl.pathname === "/dashboard") {
    if (isMobile) {
      return NextResponse.redirect(new URL("/home", request.url));
    } else if (isTablet) {
      return NextResponse.redirect(new URL("/home", request.url));
    } else if (isDesktop) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  // }
  }

  if (!user && !publicRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (request.nextUrl.pathname === "/") {
    // return NextResponse.redirect(new URL("/dashboard", request.url));
    const userAgent = request.headers.get("user-agent") || "";
  const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
  const isTablet = /iPad|Tablet/i.test(userAgent);
  const isDesktop = !isMobile && !isTablet;

  // if (request.nextUrl.pathname === "/dashboard") {
    if (isMobile) {
      console.log(request.nextUrl.pathname, " url");
      return NextResponse.redirect(new URL("/home", request.url));
    } else if (isTablet) {
      return NextResponse.redirect(new URL("/home", request.url));
    } else if (isDesktop) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  // }
  }

  // Screen size-based redirection
  // const userAgent = request.headers.get("user-agent") || "";
  // const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
  // const isTablet = /iPad|Tablet/i.test(userAgent);
  // const isDesktop = !isMobile && !isTablet;

  // if (request.nextUrl.pathname === "/dashboard") {
  //   if (isMobile) {
  //     return NextResponse.redirect(new URL("/mobile-dashboard", request.url));
  //   } else if (isTablet) {
  //     return NextResponse.redirect(new URL("/tablet-dashboard", request.url));
  //   } else if (isDesktop) {
  //     return NextResponse.redirect(new URL("/desktop-dashboard", request.url));
  //   }
  // }

  return response;
}
