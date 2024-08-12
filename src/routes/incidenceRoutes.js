import express from 'express';
import * as incidenceController from '../controllers/incidenceController.js';
import { auth } from '../middlewares/auth.js';
import uploadMiddleware from '../middlewares/upload.js';

const router = express.Router();

router.post('/', auth, uploadMiddleware, incidenceController.createIncidence);
router.get('/', auth, incidenceController.getIncidences);
router.put('/:id', auth, incidenceController.updateIncidence);
router.delete('/:id', auth, incidenceController.deleteIncidence);

export default router;