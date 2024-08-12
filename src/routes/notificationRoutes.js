// src/routes/notificationRoutes.js
/* import express from 'express';
import * as notificationController from '../controllers/notificationController.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', auth, notificationController.createNotification);
router.get('/:userId', auth, notificationController.getNotifications);

export default router; */


import express from 'express';
import { createNotification, getNotifications } from '../controllers/notificationController.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', auth, createNotification);
router.get('/:userId', auth, getNotifications);

export default router;