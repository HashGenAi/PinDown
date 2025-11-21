export default {
  async fetch(request) {
    const url = new URL(request.url);
    const pinterestUrl = url.searchParams.get("url");

    if (!pinterestUrl) {
      return new Response(JSON.stringify({ error: "Missing url parameter" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    try {
      const res = await fetch(pinterestUrl, {
        headers: { "User-Agent": "Mozilla/5.0" }
      });

      const html = await res.text();
      const match = html.match(/https?:\/\/[^\s"'<>]+\.mp4[^\s"'<>]*/i);

      return new Response(JSON.stringify({ video: match ? match[0] : null }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: "Fetch failed", details: String(err) }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
};
