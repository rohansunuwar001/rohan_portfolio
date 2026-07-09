import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

// File filter
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedCVExtensions = ['.pdf', '.docx', '.doc'];
  const allowedImageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (file.fieldname === 'cv') {
    if (allowedCVExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed for CV'), false);
    }
  } else if (file.fieldname === 'image') {
    if (allowedImageExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, JPEG, PNG, WEBP, and GIF images are allowed for project thumbnail'), false);
    }
  } else {
    cb(null, true);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});
