// R2's public dev URL (pub-*.r2.dev) has been unreliable to reach — both
// from this server's own outbound fetches and, just as often, straight from
// a browser — failing with connection resets/SSL errors on a large fraction
// of requests. Since next/image's optimizer needs to fetch the source
// server-side, that flakiness turns into broken images rather than just a
// slow one. `unoptimized` skips the server-side resize/proxy step so the
// browser fetches the original URL itself.
//
// This checks the *hostname*, not a hardcoded flag, so if R2_PUBLIC_URL is
// later switched to a custom domain (see the image performance audit notes),
// images automatically start getting real Next.js optimization again with
// no further code changes.
export function isR2DevUrl(url: string): boolean {
  try {
    return new URL(url).hostname.endsWith(".r2.dev");
  } catch {
    return false;
  }
}
