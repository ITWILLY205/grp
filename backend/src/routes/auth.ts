import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { generateToken } from '../middleware/auth.js';

const router = Router();

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

const studentLoginSchema = z.object({
  student_id: z.string().min(1),
  full_name: z.string().min(1),
});

// General login (Admin, Teacher, Discipline Master)
router.post('/login', async (req, res) => {
  try {
    const { username, password } = loginSchema.parse(req.body);

    // Try to find user by username first, then by email
    let user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user && username.includes('@')) {
      user = await prisma.user.findFirst({
        where: { email: username },
      });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password (support both hashed and plaintext during migration)
    const validPassword = user.password.startsWith('$2')
      ? await bcrypt.compare(password, user.password)
      : user.password === password;

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Hash plaintext passwords on first successful login
    if (!user.password.startsWith('$2')) {
      await prisma.user.update({
        where: { id: user.id },
        data: { password: await bcrypt.hash(password, 10) },
      });
    }

    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role,
      full_name: user.full_name,
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        full_name: user.full_name,
        email: user.email,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Student login (by student_id and full_name)
router.post('/student-login', async (req, res) => {
  try {
    const { student_id, full_name } = studentLoginSchema.parse(req.body);

    const student = await prisma.student.findFirst({
      where: {
        student_id,
        user: { full_name },
      },
      include: { user: true },
    });

    if (!student) {
      return res.status(401).json({ error: 'Student not found' });
    }

    const token = generateToken({
      id: student.user.id,
      username: student.student_id,
      role: 'STUDENT',
      full_name: student.user.full_name,
    });

    res.json({
      success: true,
      token,
      user: {
        id: student.user.id,
        username: student.student_id,
        role: 'STUDENT',
        full_name: student.user.full_name,
        student_id: student.student_id,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Student login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Register new user (Admin only - password will be auto-hashed)
router.post('/register', async (req, res) => {
  try {
    const schema = z.object({
      username: z.string().min(3),
      password: z.string().min(6),
      role: z.enum(['ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'DISCIPLINE_MASTER']),
      full_name: z.string().optional(),
      email: z.string().email().optional(),
    });

    const data = schema.parse(req.body);

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        username: data.username,
        password: hashedPassword,
        role: data.role,
        full_name: data.full_name || null,
        email: data.email || null,
      },
    });

    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        full_name: user.full_name,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    if ((error as { code?: string }).code === 'P2002') {
      return res.status(409).json({ error: 'Username already exists' });
    }
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Change password
router.post('/change-password', async (req, res) => {
  try {
    const schema = z.object({
      userId: z.number(),
      currentPassword: z.string(),
      newPassword: z.string().min(6),
    });

    const { userId, currentPassword, newPassword } = schema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const validPassword = user.password.startsWith('$2')
      ? await bcrypt.compare(currentPassword, user.password)
      : user.password === currentPassword;

    if (!validPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
