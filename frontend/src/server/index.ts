// ⚠️  DEPRECATED / NOT FOR PRODUCTION
// This is an older standalone server (raw MySQL) kept for local reference only.
// The deployed backend lives in the root `back/` folder (Prisma + Express).
// The frontend `api.ts` calls the deployed backend, not this file.

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

// --- 1. AUTHENTICATION ---
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows]: any = await pool.execute(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password]
    );
    if (rows.length > 0) {
      const user = rows[0];
      res.json({ success: true, user: { id: user.id, username: user.username, role: user.role, full_name: user.full_name } });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Student Login (by Index Number and Full Name)
app.post('/api/student-login', async (req, res) => {
  const { student_id, full_name } = req.body;

  if (!student_id || !full_name) {
    return res.status(400).json({ error: 'Index Number and Full Name required' });
  }

  try {
    const [rows]: any = await pool.execute(`
      SELECT u.id, u.username, u.role, u.full_name, s.student_id 
      FROM students s 
      JOIN users u ON s.user_id = u.id 
      WHERE s.student_id = ? AND u.full_name = ?
    `, [student_id, full_name]);

    if (rows.length > 0) {
      const user = rows[0];
      res.json({
        success: true,
        user: {
          id: user.id,
          username: user.student_id, // we can use their ID as their token internally
          role: 'STUDENT',
          full_name: user.full_name
        }
      });
    } else {
      res.status(401).json({ error: 'Student not found with this Index Number and Name.' });
    }
  } catch (error) {
    console.error('Database Error (student-login):', error);
    res.status(500).json({ error: 'Login failed due to server error.' });
  }
});

// --- 2. ACADEMIC STRUCTURE ---

// Years
app.get('/api/academic-years', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM academic_years ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    console.error('Database Error (academic-years):', error);
    res.status(500).json({ error: 'Failed to fetch academic years' });
  }
});

app.post('/api/academic-years', async (req, res) => {
  const { name } = req.body;
  const [result]: any = await pool.execute('INSERT INTO academic_years (name) VALUES (?)', [name]);
  res.json({ id: result.insertId, name, status: 'Active' });
});

// Terms
app.get('/api/terms', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT t.*, y.name as year_name FROM terms t JOIN academic_years y ON t.year_id = y.id');
    res.json(rows);
  } catch (error) {
    console.error('Database Error (terms):', error);
    res.status(500).json({ error: 'Failed to fetch terms' });
  }
});

app.post('/api/terms', async (req, res) => {
  const { year_id, name, start_date, end_date } = req.body;
  const [result]: any = await pool.execute(
    'INSERT INTO terms (year_id, name, start_date, end_date) VALUES (?, ?, ?, ?)',
    [year_id, name, start_date, end_date]
  );
  res.json({ id: result.insertId, year_id, name });
});

// Classes & Streams
app.get('/api/classes', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM classes');
    res.json(rows);
  } catch (error) {
    console.error('Database Error (classes):', error);
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
});

app.post('/api/classes', async (req, res) => {
  const { name } = req.body;
  const [result]: any = await pool.execute('INSERT INTO classes (name) VALUES (?)', [name]);
  res.json({ id: result.insertId, name });
});

app.get('/api/streams', async (req, res) => {
  const [rows] = await pool.execute('SELECT s.*, c.name as class_name FROM streams s JOIN classes c ON s.class_id = c.id');
  res.json(rows);
});

// Subjects
app.get('/api/subjects', async (req, res) => {
  const [rows] = await pool.execute('SELECT * FROM subjects');
  res.json(rows);
});

// --- 3. TEACHERS & ASSIGNMENTS ---
app.get('/api/teachers', async (req, res) => {
  const [rows] = await pool.execute('SELECT t.*, u.full_name, u.username FROM teachers t JOIN users u ON t.user_id = u.id');
  res.json(rows);
});

app.post('/api/teachers', async (req, res) => {
  const { username, password, full_name, staff_id, specialization } = req.body;
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [uResult]: any = await connection.execute(
      'INSERT INTO users (username, password, role, full_name) VALUES (?, ?, "TEACHER", ?)',
      [username, password, full_name]
    );
    const userId = uResult.insertId;
    const [tResult]: any = await connection.execute(
      'INSERT INTO teachers (user_id, staff_id, specialization) VALUES (?, ?, ?)',
      [userId, staff_id, specialization]
    );
    await connection.commit();
    res.json({ id: tResult.insertId, full_name, staff_id });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: 'Failed to create teacher' });
  } finally {
    connection.release();
  }
});

// --- 4. STUDENTS & REGISTRATION ---
app.get('/api/students', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT s.*, u.full_name, c.name as class_name 
      FROM students s 
      JOIN users u ON s.user_id = u.id 
      LEFT JOIN classes c ON s.class_id = c.id
    `);
    res.json(rows);
  } catch (error) {
    console.error('Database Error (students):', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

app.post('/api/students', async (req, res) => {
  const { username, password, full_name, student_id, class_id, stream_id, parent_name, parent_phone } = req.body;
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [uResult]: any = await connection.execute(
      'INSERT INTO users (username, password, role, full_name) VALUES (?, ?, "STUDENT", ?)',
      [username, password, full_name]
    );
    const userId = uResult.insertId;
    const [sResult]: any = await connection.execute(
      'INSERT INTO students (user_id, student_id, class_id, stream_id, parent_name, parent_phone) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, student_id, class_id, stream_id || null, parent_name || null, parent_phone || null]
    );
    await connection.commit();
    res.json({ id: sResult.insertId, full_name, student_id });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: 'Failed to create student' });
  } finally {
    connection.release();
  }
});

// --- 5. ACADEMIC RECORDS (MARKS & ATTENDANCE) ---
app.post('/api/marks', async (req, res) => {
  const { student_id, subject_id, term_id, cat_score, exam_score, grade } = req.body;
  const total_score = (cat_score || 0) + (exam_score || 0);
  try {
    const [result]: any = await pool.execute(
      'INSERT INTO marks (student_id, subject_id, term_id, cat_score, exam_score, total_score, grade) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE cat_score=?, exam_score=?, total_score=?, grade=?',
      [student_id, subject_id, term_id, cat_score || 0, exam_score || 0, total_score || 0, grade || null, cat_score || 0, exam_score || 0, total_score || 0, grade || null]
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Database Error (marks):', error);
    res.status(500).json({ error: 'Failed to record marks' });
  }
});

app.get('/api/marks/:studentId', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT m.*, s.name as subject_name, t.name as term_name
      FROM marks m 
      JOIN subjects s ON m.subject_id = s.id
      LEFT JOIN terms t ON m.term_id = t.id
      WHERE m.student_id = ?
    `, [req.params.studentId]);
    res.json(rows);
  } catch (error) {
    console.error('Database Error (get-marks):', error);
    res.status(500).json({ error: 'Failed to fetch marks' });
  }
});

// --- 6. DISCIPLINE DEDUCTION + PARENT NOTIFICATION ---
app.post('/api/discipline/deduct', async (req, res) => {
  const { student_id, subject_id, points, reason, category, date } = req.body;

  if (!student_id || !points || !reason) {
    return res.status(400).json({ error: 'student_id, points, and reason are required' });
  }

  try {
    // 1. Get student & parent info
    const [studentRows]: any = await pool.execute(`
      SELECT u.full_name, s.parent_name, s.parent_phone, s.user_id
      FROM students s JOIN users u ON s.user_id = u.id
      WHERE s.id = ?
    `, [student_id]);

    if (studentRows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const student = studentRows[0];

    // 2. Deduct from marks if any exist (update all subjects or just the first found)
    const targetSubjectId = subject_id || 1;
    await pool.execute(`
      UPDATE marks SET 
        total_score = GREATEST(0, total_score - ?),
        grade = CASE
          WHEN GREATEST(0, total_score - ?) >= 80 THEN 'A'
          WHEN GREATEST(0, total_score - ?) >= 70 THEN 'B'
          WHEN GREATEST(0, total_score - ?) >= 60 THEN 'C'
          WHEN GREATEST(0, total_score - ?) >= 50 THEN 'D'
          ELSE 'F'
        END
      WHERE student_id = ? AND subject_id = ?
    `, [points, points, points, points, points, student_id, targetSubjectId]);

    // 3. Record in discipline_records table
    await pool.execute(
      `INSERT INTO discipline_records (student_id, points_deducted, category, reason, incident_date) VALUES (?, ?, ?, ?, ?)`,
      [student_id, points, category || 'General', reason, date || new Date().toISOString().split('T')[0]]
    );

    // 4. Notify student's user account
    const message = `DISCIPLINE ALERT: ${student.full_name} had ${points} mark(s) deducted for: ${category || 'Indiscipline'}. Reason: ${reason}. Date: ${date || new Date().toISOString().split('T')[0]}.`;
    await pool.execute(
      `INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)`,
      [student.user_id, 'Discipline Mark Deduction', message, 'discipline']
    );

    res.json({ success: true, message: `Marks deducted and ${student.full_name} notified.` });
  } catch (error: any) {
    console.error('Database Error (deduct-marks):', error?.message || error);
    res.status(500).json({ error: 'Failed to process deduction', detail: error?.message });
  }
});

// Get notifications for a user (student or parent)
app.get('/api/notifications/:userId', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
      [req.params.userId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Database Error (notifications):', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// --- 6. DASHBOARD STATS ---
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const [[{count: students}]]: any = await pool.execute('SELECT COUNT(*) as count FROM students');
    const [[{count: teachers}]]: any = await pool.execute('SELECT COUNT(*) as count FROM teachers');
    const [[{count: users}]]: any = await pool.execute('SELECT COUNT(*) as count FROM users');
    const [[{count: classes}]]: any = await pool.execute('SELECT COUNT(*) as count FROM classes');
    res.json({ students, teachers, users, classes });
  } catch (error) {
    res.status(500).json({ error: 'Stats error' });
  }
});

app.listen(PORT, () => console.log(`🚀 Backend running at http://localhost:${PORT}`));
