import multer from 'multer';

const uploadMiddleware = multer({
    limits: {
        fileSize: 4 * 1024 * 1024,
    }
});
export default uploadMiddleware;