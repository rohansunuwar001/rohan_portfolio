import { Router } from 'express';
import * as projectController from '../controller/project.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { upload } from '../helper/upload.helper.js';

const router = Router();

// Public routes
router.get('/', projectController.getAllProjects);

// Protected routes (admin only)
router.post('/', authenticateToken, projectController.createProject);
router.put('/:id', authenticateToken, projectController.updateProject);
router.delete('/:id', authenticateToken, projectController.deleteProject);

// Image upload endpoint
router.post('/upload', authenticateToken, upload.single('image'), (req: any, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  return res.status(200).json({
    message: 'Image uploaded successfully',
    imageUrl,
  });
});

export default router;
