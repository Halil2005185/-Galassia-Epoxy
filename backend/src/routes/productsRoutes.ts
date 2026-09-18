import express from "express";
import { AddProducts, DeleteProducts, GetProducts, UpdateProducts } from "../controllers/productsController.js";

const route = express.Router();

route.get("/",GetProducts);
route.post("/add-product",AddProducts);
route.put("/update-product/:id",UpdateProducts);
route.delete("/delete-product/:id",DeleteProducts);

export default route;