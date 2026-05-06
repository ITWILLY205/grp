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

// Get all discipline incidents
router.get('/', authenticate, authorize('ADMIN', 'DISCIPLINE_MASTER', 'TEACHER'), async (req, res) => {
  try {
    const incidents = await prisma.disciplineIncident.findMany({
      include: {
        student: {
          include: {
            user: {
              select: {
                full_name: true,
              },
            },
            class: true,
            stream: true,
          },
        },
        reporter: {
          select: {
            full_name: true,
            role: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });
    res.json(incidents);
  } catch (error) {
    console.error('Get incidents error:', error);
    res.status(500).json({ error: 'Failed to fetch incidents' });
  }
});

// Get incidents for a specific student
router.get('/student/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const studentId = parseInt(req.params.id);

    // Students can only view their own incidents
    if (req.user?.role === 'STUDENT') {
      const student = await prisma.student.findFirst({
        where: { user_id: req.user.id },
      });
      if (!student || student.id !== studentId) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    const incidents = await prisma.disciplineIncident.findMany({
      where: { student_id: studentId },
      include: {
        reporter: {
          select: {
            full_name: true,
            role: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });

    res.json(incidents);
  } catch (error) {
    console.error('Get student incidents error:', error);
    res.status(500).json({ error: 'Failed to fetch incidents' });
  }
});

// Create discipline incident
router.post('/', authenticate, authorize('ADMIN', 'DISCIPLINE_MASTER', 'TEACHER'), async (req: AuthRequest, res) => {
  try {
    const schema = z.object({
      student_id: z.number(),
      description: z.string().min(1),
      action_taken: z.string().optional(),
      punishment_marks: z.number().default(0),
      date: z.string().datetime().optional(),
    });

    const data = schema.parse(req.body);

    const incident = await prisma.$transaction(async (tx) => {
      // Create incident
      const incident = await tx.disciplineIncident.create({
        data: {
          student_id: data.student_id,
          reported_by: req.user!.id,
          description: data.description,
          action_taken: data.action_taken || null,
          punishment_marks: data.punishment_marks,
          date: data.date ? new Date(data.date) : new Date(),
        },
        include: {
          student: {
            include: {
              user: {
                select: {
                  full_name: true,
                  id: true,
                },
              },
            },
          },
        },
      });

      // Deduct marks from student if punishment_marks > 0
      if (data.punishment_marks > 0) {
        // Get student's marks and deduct from each
        const marks = await tx.mark.findMany({
          where: { student_id: data.student_id },
        });

        for (const mark of marks) {
          const newTotal = Math.max(0, mark.total_score - data.punishment_marks);
          await tx.mark.update({
            where: { id: mark.id },
            data: {
              total_score: newTotal,
              grade: calculateGrade(newTotal),
            },
          });
        }

        // Create notification for student
        await tx.notification.create({
          data: {
            recipient_id: incident.student.user.id,
            title: 'Discipline Mark Deduction',
            message: `${data.punishment_marks} mark(s) deducted for: ${data.description}`,
            type: 'discipline',
            sender_id: req.user!.id,
          },
        });
      }

      return incident;
    });

    res.status(201).json({ success: true, incident });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Create incident error:', error);
    res.status(500).json({ error: 'Failed to create incident' });
  }
});

// Update incident
router.patch('/:id', authenticate, authorize('ADMIN', 'DISCIPLINE_MASTER'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const schema = z.object({
      description: z.string().optional(),
      action_taken: z.string().optional(),
      punishment_marks: z.number().optional(),
      date: z.string().datetime().optional(),
    });

    const data = schema.parse(req.body);

    const incident = await prisma.disciplineIncident.update({
      where: { id },
      data: {
        description: data.description,
        action_taken: data.action_taken,
        punishment_marks: data.punishment_marks,
        date: data.date ? new Date(data.date) : undefined,
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
        reporter: {
          select: {
            full_name: true,
          },
        },
      },
    });

    res.json({ success: true, incident });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Update incident error:', error);
    res.status(500).json({ error: 'Failed to update incident' });
  }
});

// Delete incident
router.delete('/:id', authenticate, authorize('ADMIN', 'DISCIPLINE_MASTER'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    await prisma.disciplineIncident.delete({
      where: { id },
    });

    res.json({ success: true, message: 'Incident deleted' });
  } catch (error) {
    console.error('Delete incident error:', error);
    res.status(500).json({ error: 'Failed to delete incident' });
  }
});

export default router;
