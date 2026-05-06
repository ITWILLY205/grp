import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Get attendance for a student
router.get('/student/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const studentId = parseInt(req.params.id);
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 30;

    // Students can only view their own attendance
    if (req.user?.role === 'STUDENT') {
      const student = await prisma.student.findFirst({
        where: { user_id: req.user.id },
      });
      if (!student || student.id !== studentId) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    const attendance = await prisma.attendance.findMany({
      where: { student_id: studentId },
      orderBy: { date: 'desc' },
      take: limit,
    });

    res.json(attendance);
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
});

// Get attendance for a class on a specific date
router.get('/class/:classId', authenticate, authorize('ADMIN', 'TEACHER', 'DISCIPLINE_MASTER'), async (req, res) => {
  try {
    const classId = parseInt(req.params.classId);
    const streamId = req.query.stream ? parseInt(req.query.stream as string) : undefined;
    const date = req.query.date as string;

    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    const attendance = await prisma.attendance.findMany({
      where: {
        student: {
          class_id: classId,
          ...(streamId && { stream_id: streamId }),
        },
        date: new Date(date),
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
      },
    });

    res.json(attendance);
  } catch (error) {
    console.error('Get class attendance error:', error);
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
});

// Mark attendance (bulk)
router.post('/', authenticate, authorize('ADMIN', 'TEACHER', 'DISCIPLINE_MASTER'), async (req, res) => {
  try {
    const schema = z.array(
      z.object({
        student_id: z.number(),
        date: z.string().datetime(),
        status: z.enum(['Present', 'Absent', 'Excused']),
      })
    );

    const attendanceData = schema.parse(req.body);

    const results = await prisma.$transaction(
      attendanceData.map((data) =>
        prisma.attendance.upsert({
          where: {
            student_id_date: {
              student_id: data.student_id,
              date: new Date(data.date),
            },
          },
          update: {
            status: data.status,
          },
          create: {
            student_id: data.student_id,
            date: new Date(data.date),
            status: data.status,
          },
        })
      )
    );

    res.json({ success: true, count: results.length });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Mark attendance error:', error);
    res.status(500).json({ error: 'Failed to mark attendance' });
  }
});

// Get attendance statistics
router.get('/stats/:classId', authenticate, authorize('ADMIN', 'TEACHER', 'DISCIPLINE_MASTER'), async (req, res) => {
  try {
    const classId = parseInt(req.params.classId);
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    const whereClause = {
      student: {
        class_id: classId,
      },
      ...(startDate && endDate && {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      }),
    };

    const [present, absent, excused, total] = await Promise.all([
      prisma.attendance.count({
        where: { ...whereClause, status: 'Present' },
      }),
      prisma.attendance.count({
        where: { ...whereClause, status: 'Absent' },
      }),
      prisma.attendance.count({
        where: { ...whereClause, status: 'Excused' },
      }),
      prisma.attendance.count({ where: whereClause }),
    ]);

    res.json({
      present,
      absent,
      excused,
      total,
      presentPercentage: total > 0 ? ((present / total) * 100).toFixed(2) : 0,
      absentPercentage: total > 0 ? ((absent / total) * 100).toFixed(2) : 0,
    });
  } catch (error) {
    console.error('Get attendance stats error:', error);
    res.status(500).json({ error: 'Failed to fetch attendance statistics' });
  }
});

export default router;
