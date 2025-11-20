export default {
  async fetch(request) {
    try {
      const url = new URL(request.url);
      const pinUrl = url.searchParams.get("url");

      if (!pinUrl) {
        return new Response(JSON.stringify({ error: "No URL provided" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Fetch Pinterest page with proper headers
      const response = await fetch(pinUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
                        "AppleWebKit/537.36 (KHTML, like Gecko) " +
                        "Chrome/117.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Referer": "https://www.pinterest.com/"
        }
      });

      const html = await response.text();

      // Extract image URL from page HTML
      const match = html.match(/"url":"(https:\\/\\/i\.pinimg\.com[^"]+)"/);

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
      return new Response(JSON.stringify({ error: "Server error: " + e.toString() }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
};
