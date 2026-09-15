import fs from 'fs';
import path from 'path';
import { pool } from '../../lib/db';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const fileField = 'file';

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }

    const body = Buffer.concat(chunks);
    const boundary = req.headers['content-type']?.split('boundary=')[1];

    if (!boundary) {
      return res.status(400).json({ error: 'Invalid upload payload' });
    }

    const parts = body.toString('binary').split(`--${boundary}`);
    const filePart = parts.find((part) => part.includes('name="file"'));

    if (!filePart) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const headersMatch = filePart.match(/Content-Type:\s*([^\r\n]+)/i);
    const fileType = headersMatch ? headersMatch[1].trim() : 'application/octet-stream';
    const contentDisposition = filePart.match(/Content-Disposition:.*name="file"; filename="([^"]+)"/i);
    const fileName = contentDisposition ? contentDisposition[1] : 'upload';

    const fileData = filePart.split('\r\n\r\n');
    const binaryData = fileData[1] || '';
    const buffer = Buffer.from(binaryData, 'binary');

    const sanitizeName = fileName.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const filePath = path.join(uploadDir, sanitizeName);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${sanitizeName}`;

    if (id) {
      await pool.execute('UPDATE students SET photo_url = ? WHERE id = ?', [publicUrl, String(id)]);
    }

    return res.status(200).json({ success: true, url: publicUrl });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Upload failed' });
  }
}
