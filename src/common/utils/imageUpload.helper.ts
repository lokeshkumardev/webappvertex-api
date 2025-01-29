import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

export const imageUploadConfig = () => ({
  storage: diskStorage({
    destination: (req, file, cb) => {
      // Check if the route contains "subcategories" or "categories"
      const isSubCategoryRoute = req.originalUrl.includes('subcategories');
      const uploadFolder = `./assets/${isSubCategoryRoute ? 'subCategory' : 'category'}`;

      // Ensure the folder exists
      if (!fs.existsSync(uploadFolder)) {
        fs.mkdirSync(uploadFolder, { recursive: true });
      }

      cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
      // Generate unique filename
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    // Validate file type
    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // Set file size limit (5 MB)
});
