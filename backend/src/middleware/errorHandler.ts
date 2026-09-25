import { type Request, type Response, type NextFunction } from "express";

type MongoLikeError = Error & {
    name: string;
    path?: string;
    code?: number;
    keyValue?: Record<string, unknown>;
};

function errorHandler(
    err: MongoLikeError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (res.headersSent) {
        return next(err);
    }

    if (err.name === "CastError") {
        res.status(400).json({ message: `Invalid value for field "${err.path}".` });
        return;
    }

    if (err.name === "ValidationError") {
        res.status(400).json({ message: err.message });
        return;
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue ?? {})[0] ?? "field";
        res.status(409).json({ message: `A record with this ${field} already exists.` });
        return;
    }

    // Multer's own limit errors (file too large, too many files, unexpected
    // field) and the custom file-type rejection below — both have safe,
    // client-actionable messages, so they're exempt from the production
    // error-masking below.
    if (err.name === "MulterError" || err.name === "FileValidationError") {
        res.status(400).json({ message: err.message });
        return;
    }

    // Log the real error server-side, but never hand an unexpected error's
    // message (which can contain internals — file paths, driver/SDK detail,
    // connection strings) back to the client in production.
    console.error(err);
    const isProduction = process.env.NODE_ENV === "production";
    res.status(500).json({
        message: isProduction || !err.message ? "Internal Server Error" : err.message,
    });
}

export default errorHandler;