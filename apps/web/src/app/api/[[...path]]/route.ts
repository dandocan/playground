function forwardingHeaders(original: Headers): Headers {
  const headers = new Headers(original);
  const connectionHeaders = headers.get("connection")?.split(",") ?? [];
  for (const name of [
    ...connectionHeaders,
    "connection",
    "keep-alive",
    "proxy-authenticate",
    "proxy-authorization",
    "te",
    "trailer",
    "transfer-encoding",
    "upgrade",
    "host",
    "content-length",
  ]) {
    headers.delete(name.trim());
  }
  return headers;
}

async function proxy(request: Request): Promise<Response> {
  const apiUrl = process.env.API_URL;
  if (!apiUrl && process.env.VERCEL) {
    console.error("API_URL service binding is missing.");
    return new Response("API service is not configured.", { status: 500 });
  }

  try {
    const incoming = new URL(request.url);
    const target = new URL(apiUrl ?? "http://localhost:3001");
    // Append to the binding's base path without interpreting user paths as URLs.
    target.pathname =
      target.pathname.replace(/\/+$/, "") +
      (incoming.pathname.slice("/api".length) || "/");
    target.search = incoming.search;
    const upstream = await fetch(target, {
      method: request.method,
      headers: forwardingHeaders(request.headers),
      body:
        request.method === "GET" || request.method === "HEAD"
          ? undefined
          : await request.arrayBuffer(),
      redirect: "manual",
      cache: "no-store",
      signal: request.signal,
    });
    const headers = forwardingHeaders(upstream.headers);
    // Fetch decompresses the body; forwarding its original encoding would corrupt it.
    headers.delete("content-encoding");
    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers,
    });
  } catch (error) {
    console.error("API proxy request failed:", error);
    return new Response("API service is unavailable.", { status: 502 });
  }
}

export {
  proxy as GET,
  proxy as HEAD,
  proxy as POST,
  proxy as PUT,
  proxy as PATCH,
  proxy as DELETE,
  proxy as OPTIONS,
};
