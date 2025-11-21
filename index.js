export default {
  async fetch(request) {
    const url = new URL(request.url);
    const target = url.searchParams.get("url");

    if (!target) {
      return new Response(JSON.stringify({ error: "Missing url parameter" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    try {
      const res = await fetch(target, {
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
      });

      const body = await res.arrayBuffer();
      const response = new Response(body, {
        status: res.status,
        statusText: res.statusText,
        headers: res.headers,
      });

      // Add CORS headers
      response.headers.set("Access-Control-Allow-Origin", "*");
      response.headers.set("Access-Control-Allow-Methods", "GET,HEAD,POST,OPTIONS");
      response.headers.set("Access-Control-Allow-Headers", "*");

      return response;
    } catch (err) {
      return new Response(JSON.stringify({ error: "Fetch failed", details: String(err) }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
};
