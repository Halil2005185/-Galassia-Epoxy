import express from "express";
import errorHandler from "./middleware/errorHandler.js";
import productsRoutes from "./routes/productsRoutes.js";
import categoriesRoutes from "./routes/categoriesRoutes.js";
import cors from "cors";

const app = express();

app.use(
    cors({
        origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
        credentials: true,
    }),
);

app.use(express.json());

app.use("/api/products", productsRoutes);

app.use("/api/categories", categoriesRoutes);

app.use(errorHandler);

export default app;
