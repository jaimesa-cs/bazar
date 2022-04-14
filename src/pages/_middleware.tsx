import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

import { Stack } from "contentstack";
import { fetchEntry } from "@framework/utils/contentstack";

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  console.log("MIDDLEWARE", req.url);
  // if (req.nextUrl.pathname.startsWith("/v3")) {
  //   console.log("LIVE: V3", `https://api.contentstack.io${req.nextUrl.href}`);
  //   console.log(req.headers);
  //   req.headers.append("api_key", process.env.NEXT_PUBLIC_CS_API_KEY || "");
  //   req.headers.append("access_token", process.env.NEXT_PUBLIC_CS_DELIVERY_TOKEN || "");
  //   return NextResponse.rewrite(`https://api.contentstack.io${req.nextUrl.href}`);
  // }

  if (
    !req.nextUrl.pathname.startsWith("/live-preview") &&
    req.nextUrl.searchParams.has("live_preview") &&
    req.nextUrl.searchParams.has("content_type_uid")
  ) {
    console.log(`IS PREVIEW >> /live-preview${req.nextUrl.href}`);
    return NextResponse.rewrite(`/live-preview${req.nextUrl.href}`);
  }
  // console.log(`IS NOT PREVIEW >> ${req.nextUrl.href}`);
}
