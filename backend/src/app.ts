import express from "express";
import errorHandler from "./middleware/errorHandler.js";
import productsRoutes from "./routes/productsRoutes.js";
import categoriesRoutes from "./routes/categoriesRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Comma-separated list, e.g. "https://admin.example.com,https://example.com".
// Falls back to local dev origins when CORS_ORIGIN isn't set.
const corsOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
    : ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"];

app.use(
    cors({
        origin: corsOrigins,
        credentials: true,
    }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.use("/api/products", productsRoutes);

app.use("/api/categories", categoriesRoutes);

app.use(errorHandler);

export default app;
