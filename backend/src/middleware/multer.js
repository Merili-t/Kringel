import multer from 'multer';

const storage = multer.memoryStorage(); //req.file.buffer

export default multer({ storage });
