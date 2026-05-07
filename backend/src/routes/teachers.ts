import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Get current teacher (me)
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    const teacher = await prisma.teacher.findUnique({
      where: { user_id: userId },
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            email: true,
            username: true,
            created_at: true,
          },
        },
        assignments: {
          include: {
            subject: true,
            stream: {
              include: {
                class: true,
              },
            },
            term: {
              include: {
                year: true,
              },
            },
          },
        },
      },
    });

    if (!teacher) {
      return res.status(404).json({ error: 'Teacher profile not found' });
    }

    res.json(teacher);
  } catch (error) {
    console.error('Get teacher me error:', error);
    res.status(500).json({ error: 'Failed to fetch teacher profile' });
  }
});

// Get all teachers
router.get('/', authenticate, async (req, res) => {
  try {
    const teachers = await prisma.teacher.findMany({
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            email: true,
            created_at: true,
          },
        },
        assignments: {
          include: {
            subject: true,
            stream: {
              include: {
                class: true,
              },
            },
            term: {
              include: {
                year: true,
              },
            },
          },
        },
      },
      orderBy: {
        user: {
          full_name: 'asc',
        },
      },
    });
    res.json(teachers);
  } catch (error) {
    console.error('Get teachers error:', error);
    res.status(500).json({ error: 'Failed to fetch teachers' });
  }
});

// Get teacher by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const teacher = await prisma.teacher.findUnique({
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
        assignments: {
          include: {
            subject: true,
            stream: {
              include: {
                class: true,
              },
            },
            term: {
              include: {
                year: true,
              },
            },
          },
        },
      },
    });

    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    res.json(teacher);
  } catch (error) {
    console.error('Get teacher error:', error);
    res.status(500).json({ error: 'Failed to fetch teacher' });
  }
});

// Create teacher
router.post('/', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const schema = z.object({
      username: z.string().min(3),
      password: z.string().min(6),
      full_name: z.string().min(1),
      staff_id: z.string().min(1),
      specialization: z.string().optional(),
    });

    const data = schema.parse(req.body);

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username: data.username,
          password: hashedPassword,
          role: 'TEACHER',
          full_name: data.full_name,
        },
      });

      const teacher = await tx.teacher.create({
        data: {
          user_id: user.id,
          staff_id: data.staff_id,
          specialization: data.specialization || null,
        },
        include: {
          user: {
            select: {
              full_name: true,
            },
          },
        },
      });

      return teacher;
    });

    res.status(201).json({ success: true, teacher: result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    if ((error as { code?: string }).code === 'P2002') {
      return res.status(409).json({ error: 'Staff ID or username already exists' });
    }
    console.error('Create teacher error:', error);
    res.status(500).json({ error: 'Failed to create teacher' });
  }
});

// Update teacher
router.patch('/:id', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const schema = z.object({
      staff_id: z.string().optional(),
      specialization: z.string().optional().nullable(),
      full_name: z.string().optional(),
    });

    const data = schema.parse(req.body);

    const result = await prisma.$transaction(async (tx) => {
      const teacher = await tx.teacher.update({
        where: { id },
        data: {
          staff_id: data.staff_id,
          specialization: data.specialization,
        },
      });

      if (data.full_name) {
        await tx.user.update({
          where: { id: teacher.user_id },
          data: { full_name: data.full_name },
        });
      }

      return tx.teacher.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              full_name: true,
            },
          },
        },
      });
    });

    res.json({ success: true, teacher: result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Update teacher error:', error);
    res.status(500).json({ error: 'Failed to update teacher' });
  }
});

// Delete teacher
router.delete('/:id', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    await prisma.$transaction(async (tx) => {
      const teacher = await tx.teacher.findUnique({
        where: { id },
      });

      if (!teacher) {
        throw new Error('Teacher not found');
      }

      await tx.teacher.delete({ where: { id } });
      await tx.user.delete({ where: { id: teacher.user_id } });
    });

    res.json({ success: true, message: 'Teacher deleted' });
  } catch (error) {
    console.error('Delete teacher error:', error);
    res.status(500).json({ error: 'Failed to delete teacher' });
  }
});

// Assign classes and subjects to a teacher
router.post('/:id/assignments', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const teacherId = parseInt(req.params.id);
    const schema = z.object({
      subjects: z.array(z.string().min(1)),
      classes: z.array(z.string().min(1)),
      streams: z.array(z.number()).optional(),
    });

    const data = schema.parse(req.body);

    // Find the currently active term (based on active academic year)
    const activeTerm = await prisma.term.findFirst({
      where: {
        year: {
          status: 'Active',
        },
      },
      orderBy: {
        id: 'desc',
      },
    });

    if (!activeTerm) {
      return res.status(400).json({ error: 'No active academic term found. Please set an active academic year and term first.' });
    }

    // Resolve subject names to IDs
    const subjects = await prisma.subject.findMany({
      where: {
        name: {
          in: data.subjects,
        },
      },
    });

    const missingSubjects = data.subjects.filter(name => !subjects.find(s => s.name === name));
    if (missingSubjects.length > 0) {
      return res.status(400).json({ error: `Subjects not found: ${missingSubjects.join(', ')}` });
    }

    let streams: { id: number }[] = [];

    // If specific stream IDs are provided, use those
    if (data.streams && data.streams.length > 0) {
      const foundStreams = await prisma.stream.findMany({
        where: {
          id: {
            in: data.streams,
          },
        },
      });
      const missingStreamIds = data.streams.filter(id => !foundStreams.find(s => s.id === id));
      if (missingStreamIds.length > 0) {
        return res.status(400).json({ error: `Streams not found: ${missingStreamIds.join(', ')}` });
      }
      streams = foundStreams;
    } else {
      // Fallback: resolve class names to IDs and get all their streams
      const classes = await prisma.class.findMany({
        where: {
          name: {
            in: data.classes,
          },
        },
        include: {
          streams: true,
        },
      });

      const missingClasses = data.classes.filter(name => !classes.find(c => c.name === name));
      if (missingClasses.length > 0) {
        return res.status(400).json({ error: `Classes not found: ${missingClasses.join(', ')}` });
      }

      streams = classes.flatMap(c => c.streams);
      if (streams.length === 0) {
        return res.status(400).json({ error: 'Selected classes have no streams. Please add streams first.' });
      }
    }

    // Replace existing assignments for this teacher in the current term
    await prisma.$transaction(async (tx) => {
      await tx.teacherAssignment.deleteMany({
        where: {
          teacher_id: teacherId,
          term_id: activeTerm.id,
        },
      });

      const assignmentSet = new Set<string>();
      const assignmentsToCreate: { teacher_id: number; subject_id: number; stream_id: number; term_id: number }[] = [];
      for (const subject of subjects) {
        for (const stream of streams) {
          const key = `${subject.id}-${stream.id}`;
          if (!assignmentSet.has(key)) {
            assignmentSet.add(key);
            assignmentsToCreate.push({
              teacher_id: teacherId,
              subject_id: subject.id,
              stream_id: stream.id,
              term_id: activeTerm.id,
            });
          }
        }
      }

      await tx.teacherAssignment.createMany({
        data: assignmentsToCreate,
      });
    });

    // Return updated teacher with assignments
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      include: {
        user: {
          select: {
            full_name: true,
          },
        },
        assignments: {
          include: {
            subject: true,
            stream: {
              include: {
                class: true,
              },
            },
            term: {
              include: {
                year: true,
              },
            },
          },
        },
      },
    });

    res.json({ success: true, teacher });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Assign classes error:', error);
    res.status(500).json({ error: 'Failed to assign classes and subjects' });
  }
});

export default router;
