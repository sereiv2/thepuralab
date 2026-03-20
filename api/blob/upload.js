const { put } = require("@vercel/blob");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Filename");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const filename =
      req.query.filename || req.headers["x-filename"] || `upload-${Date.now()}`;
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);

    const blob = await put(`puralab/${filename}`, buffer, {
      access: "public",
      contentType: req.headers["content-type"] || "application/octet-stream",
    });

    return res
      .status(200)
      .json({ url: blob.url, downloadUrl: blob.downloadUrl });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: err.message });
  }
};
