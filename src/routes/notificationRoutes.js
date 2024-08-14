import express from 'express';
import { createNotification, getNotifications } from '../controllers/notificationController.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', auth, createNotification);
router.get('/:userId', auth, getNotifications);

export default router;