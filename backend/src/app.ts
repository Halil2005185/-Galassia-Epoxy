import  express from "express";
import productsRoutes from "./routes/productsRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(express.json());

app.use("/api/products", productsRoutes );



app.use(errorHandler);

export default app;