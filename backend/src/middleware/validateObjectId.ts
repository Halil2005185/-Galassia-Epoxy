import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

// A malformed :id already gets caught downstream as a Mongoose CastError
// (mapped to 400 by errorHandler), but validating it explicitly here keeps
// obviously-invalid input from reaching a database call at all.
function validateObjectId(paramName: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        const value = req.params[paramName];
        if (!value || !mongoose.isValidObjectId(value)) {
            res.status(400).json({ message: `Invalid ${paramName}.` });
            return;
        }
        next();
    };
}

export default validateObjectId;
