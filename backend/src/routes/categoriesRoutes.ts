import express from "express";
import { addCategory, deleteCategory, getAllCategories, updateCategory } from "../controllers/categoriesController.js";

const route = express.Router();

// api/categories (Get all categories)
route.get("/" , getAllCategories);

// api/categories/add-category (Add a new category)
route.post("/add-category" , addCategory);


// api/categories/update-category/:id (Update a category by ID)
route.put("/update-category/:id" , updateCategory);


// api/categories/delete-category/:id (Delete a category by ID) 
route.delete("/delete-category/:id" , deleteCategory);


export default route;