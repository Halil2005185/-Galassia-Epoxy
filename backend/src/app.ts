import express from "express";
import errorHandler from "./middleware/errorHandler.js";
import productsRoutes from "./routes/productsRoutes.js";
import categoriesRoutes from "./routes/categoriesRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const corsOrigins = [
    process.env.FRONTEND_URL || "http://localhost:3000",
    process.env.ADMIN_URL || "http://localhost:5173",
];

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
