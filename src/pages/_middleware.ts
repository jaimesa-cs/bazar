import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  if (
    !req.nextUrl.pathname.startsWith("/live-preview") &&
    req.nextUrl.searchParams.has("live_preview") &&
    req.nextUrl.searchParams.has("content_type_uid")
  ) {
    console.log(`IS PREVIEW >> /live-preview${req.nextUrl.href}`);
    // console.log(req);
    return NextResponse.rewrite(`/live-preview${req.nextUrl.href}`);
  }
  console.log(`IS NOT PREVIEW >> ${req.nextUrl.href}`);

  return NextResponse.next();
}
