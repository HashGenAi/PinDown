addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const pinterestUrl = url.searchParams.get("url")
  if (!pinterestUrl) return new Response("Missing url parameter", { status: 400 })

  try {
    const res = await fetch(pinterestUrl, {
      headers: { "User-Agent": "Mozilla/5.0" }
    })
    const html = await res.text()
    const match = html.match(/https?:\/\/[^\s"'<>]+\.mp4[^\s"'<>]*/i)
    return new Response(JSON.stringify({ video: match ? match[0] : null }), {
      headers: { "Content-Type": "application/json" }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: "Fetch failed" }), {
      headers: { "Content-Type": "application/json" }
    })
  }
}
