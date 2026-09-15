import { pool } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  try {
    const sql = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    const [rows] = await pool.execute(sql);

    if (rows && rows.length > 0) {
      res.setHeader('Set-Cookie', 'isAdmin=true; Path=/; HttpOnly=false; SameSite=Lax');
      return res.status(200).json({ success: true, user: rows[0] });
    }

    return res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Database error' });
  }
}
