export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET() {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      'SELECT id, name, address, city, image FROM schools ORDER BY id DESC'
    );
    return NextResponse.json({ ok: true, data: rows });
  } catch (err) {
    return NextResponse.json({ ok: false, error: 'Failed to fetch schools' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const form = await req.formData();
    const name = form.get('name')?.toString().trim();
    const address = form.get('address')?.toString().trim();
    const city = form.get('city')?.toString().trim();
    const state = form.get('state')?.toString().trim();
    const contact = form.get('contact')?.toString().trim();
    const email_id = form.get('email_id')?.toString().trim();
    const file = form.get('image');

    if (!name || !address || !city || !state || !contact || !email_id || !file) {
      return NextResponse.json({ ok: false, error: 'All fields required' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.byteLength > 2 * 1024 * 1024) {
      return NextResponse.json({ ok: false, error: 'Max image size 2MB' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'schoolImages');
    await fs.mkdir(uploadDir, { recursive: true });

    const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const filename = `${Date.now()}_${safeName}`;
    const filepath = path.join(uploadDir, filename);
    await fs.writeFile(filepath, buffer);

    const imgPublicPath = `/schoolImages/${filename}`;

    const pool = getPool();
    await pool.execute(
      'INSERT INTO schools (name, address, city, state, contact, image, email_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, address, city, state, contact, imgPublicPath, email_id]
    );

    return NextResponse.json({ ok: true, message: 'School added successfully' }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: 'Failed to add school' }, { status: 500 });
  }
}
