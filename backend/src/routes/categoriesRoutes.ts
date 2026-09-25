import express from "express";
import { addCategory, deleteCategory, getAllCategories, getCategoryBySlug, updateCategory } from "../controllers/categoriesController.js";
import requireAuth from "../middleware/auth.js";

const route = express.Router();

// api/categories (Get all categories) — public, the customer frontend reads this
route.get("/" , getAllCategories);

// api/categories/slug/:slug (Get a single category by slug) — public
route.get("/slug/:slug", getCategoryBySlug);

// api/categories/add-category (Add a new category) — admin only
route.post("/add-category" , requireAuth, addCategory);


// api/categories/update-category/:id (Update a category by ID) — admin only
route.put("/update-category/:id" , requireAuth, updateCategory);


// api/categories/delete-category/:id (Delete a category by ID) — admin only
route.delete("/delete-category/:id" , requireAuth, deleteCategory);


export default route;