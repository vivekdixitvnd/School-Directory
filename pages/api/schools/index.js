// pages/api/schools/index.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import pool from '../../../lib/db';

const uploadDir = path.join(process.cwd(), 'public', 'schoolImages');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

export const config = {
  api: {
    bodyParser: false, // Multer handle करेगा
  },
};

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      return new Promise((resolve, reject) => {
        upload.single('image')(req, {}, async (err) => {
          if (err) {
            console.error('Upload error:', err);
            return res.status(400).json({ error: 'File upload failed' });
          }

          try {
            const { name, address, city, state, contact, email_id } = req.body;
            const imagePath = req.file ? `/schoolImages/${req.file.filename}` : null;

            // Validate required fields
            if (!name || !address || !city || !state || !contact || !email_id) {
              return res.status(400).json({ error: 'All fields are required' });
            }

            await pool.query(
              `INSERT INTO schools (name, address, city, state, contact, image, email_id)
               VALUES (?, ?, ?, ?, ?, ?, ?)`,
              [name, address, city, state, contact, imagePath, email_id]
            );

            res.status(201).json({ message: 'School added successfully' });
            resolve();
          } catch (dbError) {
            console.error('Database error:', dbError);
            res.status(500).json({ error: 'Database operation failed' });
            resolve();
          }
        });
      });
    } else if (req.method === 'GET') {
      try {
        const [rows] = await pool.query(
          'SELECT id, name, address, city, state, contact, image, email_id FROM schools ORDER BY id DESC'
        );
        res.status(200).json(rows);
      } catch (dbError) {
        console.error('Database error:', dbError);
        res.status(500).json({ error: 'Failed to fetch schools' });
      }
    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
