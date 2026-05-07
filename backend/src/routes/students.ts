import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Get all students with related data
router.get('/', async (req, res) => {
  try {
    const className = req.query.class_name as string | undefined;

    const where: any = {};
    if (className) {
      where.class = {
        name: className,
      };
    }

    const students = await prisma.student.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            email: true,
            created_at: true,
          },
        },
        class: true,
        stream: true,
      },
      orderBy: {
        user: {
          full_name: 'asc',
        },
      },
    });
    res.json(students);
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Get student by ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid student ID' });
    }

    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            email: true,
            created_at: true,
          },
        },
        class: true,
        stream: true,
        marks: {
          include: {
            subject: true,
            term: {
              include: {
                year: true,
              },
            },
          },
        },
        attendance: {
          orderBy: { date: 'desc' },
          take: 30,
        },
        disciplineIncidents: {
          include: {
            reporter: {
              select: {
                full_name: true,
              },
            },
          },
          orderBy: { date: 'desc' },
        },
      },
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
});

// Create student
router.post('/', async (req, res) => {
  try {
    const schema = z.object({
      username: z.string().min(3),
      password: z.string().min(6),
      full_name: z.string().min(1),
      student_id: z.string().min(1),
      class_id: z.number().optional(),
      stream_id: z.number().optional(),
      parent_name: z.string().optional(),
      parent_phone: z.string().optional(),
    });

    const data = schema.parse(req.body);

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username: data.username,
          password: hashedPassword,
          role: 'STUDENT',
          full_name: data.full_name,
        },
      });

      const student = await tx.student.create({
        data: {
          user_id: user.id,
          student_id: data.student_id,
          class_id: data.class_id || null,
          stream_id: data.stream_id || null,
          parent_name: data.parent_name || null,
          parent_phone: data.parent_phone || null,
        },
        include: {
          user: {
            select: {
              full_name: true,
            },
          },
          class: true,
          stream: true,
        },
      });

      return student;
    });

    res.status(201).json({ success: true, student: result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    if ((error as { code?: string }).code === 'P2002') {
      return res.status(409).json({ error: 'Student ID or username already exists' });
    }
    console.error('Create student error:', error);
    res.status(500).json({ error: 'Failed to create student' });
  }
});

// Update student
router.patch('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const schema = z.object({
      class_id: z.number().optional().nullable(),
      stream_id: z.number().optional().nullable(),
      parent_name: z.string().optional().nullable(),
      parent_phone: z.string().optional().nullable(),
      full_name: z.string().optional(),
    });

    const data = schema.parse(req.body);

    const result = await prisma.$transaction(async (tx) => {
      const student = await tx.student.update({
        where: { id },
        data: {
          class_id: data.class_id,
          stream_id: data.stream_id,
          parent_name: data.parent_name,
          parent_phone: data.parent_phone,
        },
      });

      if (data.full_name) {
        await tx.user.update({
          where: { id: student.user_id },
          data: { full_name: data.full_name },
        });
      }

      return tx.student.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              full_name: true,
            },
          },
          class: true,
          stream: true,
        },
      });
    });

    res.json({ success: true, student: result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Update student error:', error);
    res.status(500).json({ error: 'Failed to update student' });
  }
});

// Delete student
router.delete('/:id', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    await prisma.$transaction(async (tx) => {
      const student = await tx.student.findUnique({
        where: { id },
      });

      if (!student) {
        throw new Error('Student not found');
      }

      await tx.student.delete({ where: { id } });
      await tx.user.delete({ where: { id: student.user_id } });
    });

    res.json({ success: true, message: 'Student deleted' });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

export default router;
