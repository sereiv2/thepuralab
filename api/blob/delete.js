// api/blob/delete.js
// Vercel API Route — deletes a file from Vercel Blob
// Deploy this file to your Vercel project at: /api/blob/delete.js

import { del } from '@vercel/blob';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { url } = body;

    if (!url) return res.status(400).json({ error: 'url is required' });

    await del(url, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return res.status(200).json({ deleted: true });

  } catch (error) {
    console.error('Blob delete error:', error);
    return res.status(500).json({ error: error.message });
  }
}
