import express from "express";
import { AddProducts, DeleteProducts, GetProductBySlug, GetProducts, UpdateProducts } from "../controllers/productsController.js";
import upload from "../middleware/upload.js";
import requireAuth from "../middleware/auth.js";

const route = express.Router();

// api/products (Get all products) — public, the customer frontend reads this
route.get("/",GetProducts);

// api/products/slug/:slug (Get a single product by slug) — public
route.get("/slug/:slug", GetProductBySlug);

// api/products/add-product (Add a new product) — admin only
route.post("/add-product", requireAuth, upload.array("images", 5), AddProducts);

// api/products/update-product/:id (Update a product by ID) — admin only
route.put("/update-product/:id", requireAuth, upload.array("images", 5), UpdateProducts);

// api/products/delete-product/:id (Delete a product by ID) — admin only
route.delete("/delete-product/:id", requireAuth, DeleteProducts);

export default route; 