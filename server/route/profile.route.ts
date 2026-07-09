import { Router } from 'express';
import * as profileController from '../controller/profile.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { upload } from '../helper/upload.helper.js';

const router = Router();

// Public routes
router.get('/', profileController.getProfile);

// Protected routes (admin only)
router.put('/', authenticateToken, profileController.updateProfile);
router.post('/upload-cv', authenticateToken, upload.single('cv'), profileController.uploadCv);

export default router;
