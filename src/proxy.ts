import { NextResponse, type NextRequest } from "next/server";
import { pressStories } from "@/content/press";

const known = new Set(pressStories.map((s) => s.slug));

/**
 * With Cache Components the page shell streams before notFound() runs, so unknown press slugs would
 * answer HTTP 200 (with noindex). Return a real 404 here instead.
 */
export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2];
  if (slug && !known.has(decodeURIComponent(slug))) {
    return NextResponse.rewrite(new URL("/_not-found", request.url), { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/press/:slug",
};
