import multer from "multer";

const storage = multer.memoryStorage();

// Raster image types only — notably excludes image/svg+xml, which can embed
// <script>/event-handler content and would be served back from R2 as-is.
const ALLOWED_MIME_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
]);

function fileFilter(
    _req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) {
    if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
        cb(null, true);
    } else {
        const error = new Error("Only JPEG, PNG, WebP, or GIF image files are allowed.");
        error.name = "FileValidationError";
        cb(error);
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB per file
        files: 5,
        fields: 10, // non-file form fields (name/description/slug/category)
        fieldSize: 100 * 1024, // 100KB per text field
    },
});

export default upload;
