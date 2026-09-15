import { pool } from '../../../lib/db';

export default async function handler(req, res) {
  const { search } = req.query;

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  try {
    const searchValue = search || '';
    const sql = `SELECT * FROM students WHERE LOWER(full_name) LIKE LOWER('%${searchValue}%') ORDER BY id ASC`;
    const [rows] = await pool.execute(sql);

    return res.status(200).json({ students: rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Database error' });
  }
}
