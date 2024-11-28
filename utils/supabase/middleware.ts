import { logout } from "@/app/(signin-setup)/logout/action";
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
  // console.log("user ", userId);

  const publicRoutes = ["/sign-in"];

  if (
    (user && request.nextUrl.pathname === "/sign-in")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!user && !publicRoutes.includes(request.nextUrl.pathname)) {
    // console.log(publicRoutes, "routes");
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Redirect to the home page if there is no slug
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  

  return response;
}
