import multer from "multer";

const storage = multer.memoryStorage();

function fileFilter(
    _req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed."));
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB per file
        files: 5,
    },
});

export default upload;
