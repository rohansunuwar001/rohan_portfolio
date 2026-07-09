import { Router } from 'express';
import * as projectController from '../controller/project.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { upload } from '../helper/upload.helper.js';
import { uploadToCloudinary } from '../helper/cloudinary.helper.js';

const router = Router();

// Public routes
router.get('/', projectController.getAllProjects);

// Protected routes (admin only)
router.post('/', authenticateToken, projectController.createProject);
router.put('/:id', authenticateToken, projectController.updateProject);
router.delete('/:id', authenticateToken, projectController.deleteProject);

// Image upload endpoint
router.post('/upload', authenticateToken, upload.single('image'), async (req: any, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const imageUrl = await uploadToCloudinary(req.file.path, 'projects', 'image');
    return res.status(200).json({
      message: 'Image uploaded successfully',
      imageUrl,
    });
  } catch (error: any) {
    console.error('Project image upload error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

export default router;
