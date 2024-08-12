import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage }).single('image');

const uploadMiddleware = (req, res, next) => {
  upload(req, res, function (err) {
    if (err) {
      console.error('Error de carga:', err);
      return res.status(500).json({ error: 'Ocurrió un error desconocido' });
    }
    next();
  });
};

export default uploadMiddleware;