// api/blob/upload.js
// Vercel API Route — handles file upload to Vercel Blob
// Deploy this file to your Vercel project at: /api/blob/upload.js
//
// Required: Add BLOB_READ_WRITE_TOKEN to your Vercel environment variables
// Install: npm install @vercel/blob

import { put } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: false, // Required for multipart/form-data
  },
};

export default async function handler(req, res) {
  // CORS headers — allow your Vercel domain + localhost
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse multipart form data
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Extract filename from Content-Disposition header or query
    const filename = req.query.filename
      || req.headers['x-filename']
      || `upload-${Date.now()}`;

    const contentType = req.headers['content-type'] || 'application/octet-stream';

    // Upload to Vercel Blob
    const blob = await put(`puralab/${filename}`, buffer, {
      access: 'public',              // publicly accessible URL
      contentType,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return res.status(200).json({
      url:          blob.url,
      downloadUrl:  blob.downloadUrl,
      pathname:     blob.pathname,
      size:         blob.size,
    });

  } catch (error) {
    console.error('Blob upload error:', error);
    return res.status(500).json({ error: error.message });
  }
}
