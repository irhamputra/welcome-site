// Uses iTunes Search API — free, no API key required
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { title, artist } = req.query;

  if (!title || !artist) {
    return res.status(400).json({ error: "title and artist query params are required" });
  }

  try {
    const term = encodeURIComponent(`${artist} ${title}`);
    const itunesRes = await fetch(
      `https://itunes.apple.com/search?term=${term}&media=music&entity=song&limit=5`
    );

    if (!itunesRes.ok) {
      return res.status(itunesRes.status).json({ error: "iTunes search failed" });
    }

    const data = await itunesRes.json();

    // Pick the best match: prefer exact title match, fallback to first result
    const results = data.results ?? [];
    const match =
      results.find(
        (r) => r.trackName?.toLowerCase() === title.toLowerCase()
      ) ?? results[0];

    if (!match) {
      return res.status(404).json({ preview_url: null });
    }

    return res.status(200).json({
      preview_url: match.previewUrl ?? null,
      track_name: match.trackName,
      artist_name: match.artistName,
      album_name: match.collectionName ?? "",
      album_image: match.artworkUrl100 ?? match.artworkUrl60 ?? null,
    });
  } catch (err) {
    console.error("[music/preview]", err.message);
    return res.status(500).json({ error: err.message });
  }
}
