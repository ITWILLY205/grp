import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Get notifications for current user
router.get('/my', authenticate, async (req: AuthRequest, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        OR: [
          { recipient_id: req.user!.id },
          { recipient_role: 'ALL' },
          { recipient_role: req.user!.role },
        ],
      },
      include: {
        sender: {
          select: {
            full_name: true,
            role: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
      take: 50,
    });

    res.json(notifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Get unread count
router.get('/unread-count', authenticate, async (req: AuthRequest, res) => {
  try {
    const count = await prisma.notification.count({
      where: {
        is_read: false,
        OR: [
          { recipient_id: req.user!.id },
          { recipient_role: 'ALL' },
          { recipient_role: req.user!.role },
        ],
      },
    });

    res.json({ count });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Failed to get unread count' });
  }
});

// Mark as read
router.patch('/:id/read', authenticate, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const notification = await prisma.notification.update({
      where: { id },
      data: { is_read: true },
    });

    res.json({ success: true, notification });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ error: 'Failed to mark as read' });
  }
});

// Send notification (Admin only)
router.post('/', authenticate, authorize('ADMIN'), async (req: AuthRequest, res) => {
  try {
    const schema = z.object({
      recipient_id: z.number().optional(),
      recipient_role: z.enum(['ALL', 'TEACHER', 'STUDENT', 'PARENT']).optional(),
      title: z.string().min(1),
      message: z.string().min(1),
      type: z.enum(['general', 'discipline', 'academic', 'attendance']).default('general'),
    });

    const data = schema.parse(req.body);

    const notification = await prisma.notification.create({
      data: {
        sender_id: req.user!.id,
        recipient_id: data.recipient_id || null,
        recipient_role: data.recipient_role || null,
        title: data.title,
        message: data.message,
        type: data.type,
      },
    });

    res.status(201).json({ success: true, notification });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Send notification error:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// Delete notification
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);

    // Users can only delete their own notifications or admins can delete any
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    if (notification.recipient_id !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    await prisma.notification.delete({
      where: { id },
    });

    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

export default router;
