import { pool } from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Student id required' });
  }

  try {
    const [rows] = await pool.execute('SELECT * FROM students WHERE id = ?', [id]);
    const student = rows[0] || null;
    return res.status(200).json({ student });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Database error' });
  }
}
