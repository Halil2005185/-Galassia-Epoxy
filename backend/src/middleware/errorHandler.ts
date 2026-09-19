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

    res.status(500).json({
        message: err.message || "Internal Server Error",
    });
}

export default errorHandler;