import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const { file } = req.query;

  if (!file) {
    return res.status(400).json({ error: 'file parameter is required' });
  }

  try {
    // VULNERABILITY: Path Traversal
    const filePath = path.join(process.cwd(), String(file));
    const content = fs.readFileSync(filePath);
    res.setHeader('Content-Type', 'image/jpeg');
    return res.send(content);
  } catch (error) {
    return res.status(404).json({ error: 'File not found' });
  }
}
