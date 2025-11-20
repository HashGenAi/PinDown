export default {
  async fetch(request) {
    const url = new URL(request.url);
    const pinUrl = url.searchParams.get("url");

    if (!pinUrl) {
      return new Response(JSON.stringify({ error: "No URL provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    try {
      // Fetch Pinterest page
      const response = await fetch(pinUrl, {
        headers: { "User-Agent": "Mozilla/5.0" }
      });
      const html = await response.text();

      // Extract image (Pinterest blocks normal scrapers so we use regex)
      const match = html.match(/"url":"(https:\/\/i\.pinimg\.com[^"]+)"/);

      if (!match) {
        return new Response(JSON.stringify({ error: "Pinterest blocked or no image found" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const imageUrl = match[1].replace(/\\u0026/g, "&");

      return new Response(JSON.stringify({ image: imageUrl }), {
        headers: { "Content-Type": "application/json" },
      });

    } catch (e) {
      return new Response(JSON.stringify({ error: "Server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
};