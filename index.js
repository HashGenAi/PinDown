export default {
  async fetch(request) {
    const url = new URL(request.url);
    const pinterestUrl = url.searchParams.get("url");

    if (!pinterestUrl) {
      return new Response(JSON.stringify({ error: "Missing url parameter" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    try {
      const res = await fetch(pinterestUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0",
          Accept: "text/html",
        },
      });

      const html = await res.text();

      // Pinterest embeds JSON in <script id="__PWS_DATA__">...</script>
      const jsonMatch = html.match(/<script id="__PWS_DATA__" type="application\/json">(.+?)<\/script>/);
      if (!jsonMatch) {
        return new Response(JSON.stringify({ error: "Video data not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      const data = JSON.parse(jsonMatch[1]);
      // Navigate JSON to find video URL
      const videoUrl =
        data?.props?.initialReduxState?.pins &&
        Object.values(data.props.initialReduxState.pins)[0]?.videos?.video_list?.V_HLS?.url ||
        Object.values(data.props.initialReduxState.pins)[0]?.videos?.video_list?.V_720P?.url;

      if (videoUrl) {
        return new Response(JSON.stringify({ video: videoUrl }), {
          headers: { "Content-Type": "application/json" },
        });
      } else {
        return new Response(JSON.stringify({ error: "Video URL not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
    } catch (err) {
      return new Response(JSON.stringify({ error: "Fetch failed", details: String(err) }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};
