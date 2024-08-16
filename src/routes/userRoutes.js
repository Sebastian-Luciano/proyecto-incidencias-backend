import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../utils/validation.js';
import * as userController from '../controllers/userController.js';
import { auth, isAdmin } from '../middlewares/auth.js';
import userPhotoUpload from '../middlewares/userUpload.js';

const router = express.Router();

router.post('/register', [
    body('email').isEmail().withMessage('Email no válido'),
    body('password').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
    validateRequest
], userController.register);

router.post('/login', userController.login);

router.post('/login', userController.login);
router.put('/:id', auth, userPhotoUpload, userController.updateUser);
router.put('/:id/update-password', auth, userController.updatePassword);

export default router;