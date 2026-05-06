import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Calculate grade based on score
function calculateGrade(score: number): string {
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  return 'F';
}

// Get marks for a student
router.get('/student/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const studentId = parseInt(req.params.id);
    const termId = req.query.term ? parseInt(req.query.term as string) : undefined;

    // Students can only view their own marks
    if (req.user?.role === 'STUDENT') {
      const student = await prisma.student.findFirst({
        where: { user_id: req.user.id },
      });
      if (!student || student.id !== studentId) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    const marks = await prisma.mark.findMany({
      where: {
        student_id: studentId,
        ...(termId && { term_id: termId }),
      },
      include: {
        subject: true,
        term: {
          include: {
            year: true,
          },
        },
      },
      orderBy: [
        { term: { year_id: 'desc' } },
        { subject: { name: 'asc' } },
      ],
    });

    res.json(marks);
  } catch (error) {
    console.error('Get marks error:', error);
    res.status(500).json({ error: 'Failed to fetch marks' });
  }
});

// Get marks for a class/stream in a term (for teachers)
router.get('/class/:classId', authenticate, authorize('ADMIN', 'TEACHER'), async (req, res) => {
  try {
    const classId = parseInt(req.params.classId);
    const streamId = req.query.stream ? parseInt(req.query.stream as string) : undefined;
    const termId = req.query.term ? parseInt(req.query.term as string) : undefined;
    const subjectId = req.query.subject ? parseInt(req.query.subject as string) : undefined;

    const marks = await prisma.mark.findMany({
      where: {
        student: {
          class_id: classId,
          ...(streamId && { stream_id: streamId }),
        },
        ...(termId && { term_id: termId }),
        ...(subjectId && { subject_id: subjectId }),
      },
      include: {
        student: {
          include: {
            user: {
              select: {
                full_name: true,
              },
            },
          },
        },
        subject: true,
        term: true,
      },
      orderBy: [
        { student: { user: { full_name: 'asc' } } },
        { subject: { name: 'asc' } },
      ],
    });

    res.json(marks);
  } catch (error) {
    console.error('Get class marks error:', error);
    res.status(500).json({ error: 'Failed to fetch marks' });
  }
});

// Record or update marks (upsert)
router.post('/', authenticate, authorize('ADMIN', 'TEACHER'), async (req, res) => {
  try {
    const schema = z.object({
      student_id: z.number(),
      subject_id: z.number(),
      term_id: z.number(),
      cat_score: z.number().min(0).max(100).default(0),
      exam_score: z.number().min(0).max(100).default(0),
    });

    const data = schema.parse(req.body);
    const total_score = data.cat_score + data.exam_score;
    const grade = calculateGrade(total_score);

    const mark = await prisma.mark.upsert({
      where: {
        student_id_subject_id_term_id: {
          student_id: data.student_id,
          subject_id: data.subject_id,
          term_id: data.term_id,
        },
      },
      update: {
        cat_score: data.cat_score,
        exam_score: data.exam_score,
        total_score,
        grade,
      },
      create: {
        student_id: data.student_id,
        subject_id: data.subject_id,
        term_id: data.term_id,
        cat_score: data.cat_score,
        exam_score: data.exam_score,
        total_score,
        grade,
      },
      include: {
        student: {
          include: {
            user: {
              select: {
                full_name: true,
              },
            },
          },
        },
        subject: true,
        term: true,
      },
    });

    res.json({ success: true, mark });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Record marks error:', error);
    res.status(500).json({ error: 'Failed to record marks' });
  }
});

// Bulk update marks
router.post('/bulk', authenticate, authorize('ADMIN', 'TEACHER'), async (req, res) => {
  try {
    const schema = z.array(
      z.object({
        student_id: z.number(),
        subject_id: z.number(),
        term_id: z.number(),
        cat_score: z.number().min(0).max(100).default(0),
        exam_score: z.number().min(0).max(100).default(0),
      })
    );

    const marksData = schema.parse(req.body);

    const results = await prisma.$transaction(
      marksData.map((data) => {
        const total_score = data.cat_score + data.exam_score;
        const grade = calculateGrade(total_score);

        return prisma.mark.upsert({
          where: {
            student_id_subject_id_term_id: {
              student_id: data.student_id,
              subject_id: data.subject_id,
              term_id: data.term_id,
            },
          },
          update: {
            cat_score: data.cat_score,
            exam_score: data.exam_score,
            total_score,
            grade,
          },
          create: {
            student_id: data.student_id,
            subject_id: data.subject_id,
            term_id: data.term_id,
            cat_score: data.cat_score,
            exam_score: data.exam_score,
            total_score,
            grade,
          },
        });
      })
    );

    res.json({ success: true, count: results.length });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Bulk update marks error:', error);
    res.status(500).json({ error: 'Failed to update marks' });
  }
});

// Delete mark
router.delete('/:id', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    await prisma.mark.delete({
      where: { id },
    });

    res.json({ success: true, message: 'Mark deleted' });
  } catch (error) {
    console.error('Delete mark error:', error);
    res.status(500).json({ error: 'Failed to delete mark' });
  }
});

export default router;
