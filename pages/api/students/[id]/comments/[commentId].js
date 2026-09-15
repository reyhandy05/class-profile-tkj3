import { pool } from '../../../../../lib/db';

export default async function handler(req, res) {
  const { id, commentId } = req.query;

  if (!id || !commentId) {
    return res.status(400).json({ error: 'Student id and comment id required' });
  }

  try {
    if (req.method === 'DELETE') {
      await pool.execute('DELETE FROM comments WHERE id = ? AND student_id = ?', [
        String(commentId),
        String(id),
      ]);

      const [rows] = await pool.execute(
        'SELECT * FROM comments WHERE student_id = ? ORDER BY created_at DESC',
        [String(id)]
      );

      return res.status(200).json({ comments: rows });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Database error' });
  }
}
