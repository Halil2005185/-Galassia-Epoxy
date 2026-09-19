import express from "express";
import { AddProducts, DeleteProducts, GetProducts, UpdateProducts } from "../controllers/productsController.js";
import upload from "../middleware/upload.js";

const route = express.Router();

// api/products (Get all products)
route.get("/",GetProducts);

// api/products/add-product (Add a new product)
route.post("/add-product", upload.array("images", 5), AddProducts);

// api/products/update-product/:id (Update a product by ID)
route.put("/update-product/:id", upload.array("images", 5), UpdateProducts);

// api/products/delete-product/:id (Delete a product by ID)
route.delete("/delete-product/:id",DeleteProducts);

export default route; 