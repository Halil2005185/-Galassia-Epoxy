import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Category, categoryValidationSchema, updateCategoryValidationSchema } from "../model/Category.js";

export const getAllCategories = asyncHandler(
    async (req: Request, res: Response) => {
        const categories = await Category.find();
        res.status(200).json(categories);
    },
);

export const getCategoryBySlug = asyncHandler(
    async (req: Request, res: Response) => {
        const slug = String(req.params.slug ?? "");

        const category = await Category.findOne({ slug });

        if (!category) {
            res.status(404).json({ message: "Category not found" });
            return;
        }

        res.status(200).json(category);
    },
);

export const addCategory = asyncHandler(async (req: Request, res: Response) => {
    const { error } = categoryValidationSchema(req.body);

    if (error) {
        res.status(400).json({ message: error.details[0]?.message });
        return;
    }

    const { name, slug } = req.body;

    const existingCategory = await Category.findOne({ slug });

    if (existingCategory) {
        res.status(400).json({ message: "Category with this slug already exists" });
        return;
    }
    const newCategory = await Category.create({
        name,
        slug
    });

    res.status(201).json(newCategory);
});


export const updateCategory = asyncHandler(
    async (req: Request, res: Response) => {
        const { error } = updateCategoryValidationSchema(req.body);

        if (error) {
            res.status(400).json({ message: error.details[0]?.message });
            return;
        }

        const { name, slug } = req.body;
        const { id } = req.params;

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { name, slug },
            { new: true, runValidators: true }
        );

        if (!updatedCategory) {
            res.status(404).json({ message: "Category not found" });
            return;
        }

        res.status(200).json(updatedCategory);
    }
);

export const deleteCategory = asyncHandler(
    async (req: Request, res: Response) => {
     const { id} = req.params;

     const deletedCategory = await Category.findByIdAndDelete(id);

        if (!deletedCategory) {
            res.status(404).json({ message: "Category not found" });
            return;
        }
        res.status(200).json({ message: "Category deleted successfully" });

    },
);
