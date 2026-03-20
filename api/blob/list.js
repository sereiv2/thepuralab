// api/blob/list.js
// Vercel API Route — lists all files stored in Vercel Blob
// Deploy this file to your Vercel project at: /api/blob/list.js

import { list } from '@vercel/blob';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { blobs } = await list({
      prefix: 'puralab/',             // only list Pura Lab files
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return res.status(200).json({
      blobs: blobs.map(b => ({
        url:        b.url,
        pathname:   b.pathname,
        size:       b.size,
        uploadedAt: b.uploadedAt,
      }))
    });

  } catch (error) {
    console.error('Blob list error:', error);
    return res.status(500).json({ error: error.message });
  }
}
