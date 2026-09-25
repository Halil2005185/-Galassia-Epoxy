import express from "express";
import helmet from "helmet";
import errorHandler from "./middleware/errorHandler.js";
import { apiLimiter } from "./middleware/rateLimit.js";
import productsRoutes from "./routes/productsRoutes.js";
import categoriesRoutes from "./routes/categoriesRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Render (and most hosts) put the app behind a reverse proxy — without this,
// every request looks like it comes from the proxy's IP, which breaks
// per-client rate limiting and anything else keyed on req.ip.
app.set("trust proxy", 1);

app.use(helmet());

const corsOrigins = [
    process.env.FRONTEND_URL || "http://localhost:3000",
    process.env.ADMIN_URL || "http://localhost:5173",
];

app.use(
    cors({
        origin: corsOrigins,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }),
);

app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());
app.use("/api", apiLimiter);

app.use("/api/auth", authRoutes);

app.use("/api/products", productsRoutes);

app.use("/api/categories", categoriesRoutes);

app.use(errorHandler);

export default app;
