import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Student performance report
router.get('/student-performance/:studentId', authenticate, authorize('ADMIN', 'TEACHER'), async (req, res) => {
  try {
    const studentId = parseInt(req.params.studentId);
    const termId = req.query.term ? parseInt(req.query.term as string) : undefined;

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
    });

    const student = await prisma.student.findUnique({
      where: { id: studentId },
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

    const totalScore = marks.reduce((sum, m) => sum + m.total_score, 0);
    const average = marks.length > 0 ? (totalScore / marks.length).toFixed(2) : '0';

    res.json({
      student,
      marks,
      summary: {
        totalSubjects: marks.length,
        average,
        highestScore: Math.max(...marks.map(m => m.total_score), 0),
        lowestScore: Math.min(...marks.map(m => m.total_score), 0),
      },
    });
  } catch (error) {
    console.error('Student performance report error:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

// Class summary report
router.get('/class-summary/:classId', authenticate, authorize('ADMIN', 'TEACHER'), async (req, res) => {
  try {
    const classId = parseInt(req.params.classId);
    const streamId = req.query.stream ? parseInt(req.query.stream as string) : undefined;
    const termId = req.query.term ? parseInt(req.query.term as string) : undefined;

    const students = await prisma.student.findMany({
      where: {
        class_id: classId,
        ...(streamId && { stream_id: streamId }),
      },
      include: {
        user: {
          select: {
            full_name: true,
          },
        },
        marks: {
          where: termId ? { term_id: termId } : undefined,
          include: {
            subject: true,
          },
        },
        stream: true,
      },
    });

    const classSummary = students.map(student => {
      const totalScore = student.marks.reduce((sum, m) => sum + m.total_score, 0);
      const average = student.marks.length > 0 ? (totalScore / student.marks.length).toFixed(2) : '0';
      return {
        id: student.id,
        name: student.user.full_name,
        studentId: student.student_id,
        stream: student.stream?.name,
        subjects: student.marks.length,
        average,
        position: 0, // Will be calculated below
      };
    });

    // Sort by average and assign positions
    classSummary.sort((a, b) => parseFloat(b.average) - parseFloat(a.average));
    classSummary.forEach((student, index) => {
      student.position = index + 1;
    });

    // Class statistics
    const averages = classSummary.map(s => parseFloat(s.average));
    const classAverage = averages.length > 0
      ? (averages.reduce((a, b) => a + b, 0) / averages.length).toFixed(2)
      : '0';

    res.json({
      students: classSummary,
      statistics: {
        totalStudents: students.length,
        classAverage,
        highestAverage: Math.max(...averages, 0).toFixed(2),
        lowestAverage: Math.min(...averages, 0).toFixed(2),
      },
    });
  } catch (error) {
    console.error('Class summary report error:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

// Discipline summary report
router.get('/discipline-summary', authenticate, authorize('ADMIN', 'DISCIPLINE_MASTER'), async (req, res) => {
  try {
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

    const whereClause = {
      ...(startDate && endDate && {
        date: {
          gte: startDate,
          lte: endDate,
        },
      }),
    };

    const [incidents, totalMarksDeducted] = await Promise.all([
      prisma.disciplineIncident.findMany({
        where: whereClause,
        include: {
          student: {
            include: {
              user: {
                select: {
                  full_name: true,
                },
              },
              class: true,
            },
          },
        },
        orderBy: { date: 'desc' },
      }),
      prisma.disciplineIncident.aggregate({
        where: whereClause,
        _sum: {
          punishment_marks: true,
        },
      }),
    ]);

    // Group by class
    const byClass: Record<string, number> = {};
    incidents.forEach(incident => {
      const className = incident.student.class?.name || 'No Class';
      byClass[className] = (byClass[className] || 0) + 1;
    });

    res.json({
      totalIncidents: incidents.length,
      totalMarksDeducted: totalMarksDeducted._sum.punishment_marks || 0,
      incidents,
      byClass,
    });
  } catch (error) {
    console.error('Discipline summary report error:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

// Attendance report
router.get('/attendance/:classId', authenticate, authorize('ADMIN', 'TEACHER'), async (req, res) => {
  try {
    const classId = parseInt(req.params.classId);
    const streamId = req.query.stream ? parseInt(req.query.stream as string) : undefined;
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

    const students = await prisma.student.findMany({
      where: {
        class_id: classId,
        ...(streamId && { stream_id: streamId }),
      },
      include: {
        user: {
          select: {
            full_name: true,
          },
        },
        attendance: {
          where: startDate && endDate ? {
            date: {
              gte: startDate,
              lte: endDate,
            },
          } : undefined,
        },
      },
    });

    const attendanceReport = students.map(student => {
      const total = student.attendance.length;
      const present = student.attendance.filter(a => a.status === 'PRESENT').length;
      const absent = student.attendance.filter(a => a.status === 'ABSENT').length;
      const excused = student.attendance.filter(a => a.status === 'EXCUSED').length;

      return {
        id: student.id,
        name: student.user.full_name,
        studentId: student.student_id,
        total,
        present,
        absent,
        excused,
        percentage: total > 0 ? ((present / total) * 100).toFixed(2) : '0',
      };
    });

    res.json(attendanceReport);
  } catch (error) {
    console.error('Attendance report error:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

export default router;
