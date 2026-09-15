import { pool } from '../../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (!id) {
    return res.status(400).json({ error: 'Student id required' });
  }

  try {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id VARCHAR(50) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    if (req.method === 'GET') {
      const [rows] = await pool.execute(
        'SELECT * FROM comments WHERE student_id = ? ORDER BY created_at DESC',
        [String(id)]
      );
      return res.status(200).json({ comments: rows });
    }

    if (req.method === 'POST') {
      const { content } = req.body || {};

      if (!content || typeof content !== 'string') {
        return res.status(400).json({ error: 'Comment content is required' });
      }

      await pool.execute('INSERT INTO comments (student_id, content) VALUES (?, ?)', [
        String(id),
        content,
      ]);

      const [rows] = await pool.execute(
        'SELECT * FROM comments WHERE student_id = ? ORDER BY created_at DESC',
        [String(id)]
      );

      return res.status(201).json({ comments: rows });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Database error' });
  }
}
