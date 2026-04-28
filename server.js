// server.js — paste this into your project
const express = require('express');
const mysql   = require('mysql2/promise');
const cors    = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // serves your HTML files

// Connect using Railway's environment variable
const db = await mysql.createPool({
  uri: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// POST /api/inquiry — saves contact form
app.post('/api/inquiry', async (req, res) => {
  const { name, email, project_type, message } = req.body;
  try {
    await db.execute(
      'INSERT INTO inquiries (name, email, project_type, message) VALUES (?, ?, ?, ?)',
      [name, email, project_type, message]
    );
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/admin/view-data — returns all inquiries
app.post('/api/admin/view-data', async (req, res) => {
  const PASS = process.env.ADMIN_PASSWORD;
  if (req.body.password !== PASS) {
    return res.status(401).json({ error: 'Wrong password' });
  }
  const [rows] = await db.execute('SELECT * FROM inquiries ORDER BY created_at DESC');
  res.json(rows);
});

app.listen(process.env.PORT || 3000);