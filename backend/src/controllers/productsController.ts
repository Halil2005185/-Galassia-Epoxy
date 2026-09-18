import type { Request, Response } from "express";
import Product, { productValidationSchema, UpdateProductValidationSchema } from "../model/Product.js";
import asyncHandler from "express-async-handler";

export const GetProducts = asyncHandler(
    async (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;

        const products = await Product.find()
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        res.status(200).json(products);
    }
);


export const AddProducts = asyncHandler(async (req: Request, res: Response) => {
    const { error } = productValidationSchema(req.body);

    if (error) {
        res.status(400).json({ message: error.details[0]?.message });
        return;
    }

    const { name, description, slug, images, category } = req.body;

    const newProduct = await Product.create({
        name,
        description,
        slug,
        images,
        category,
    });

    res.status(201).json(newProduct);
});



export const UpdateProducts = asyncHandler(
    async (req: Request, res: Response) => {
        const { error } = UpdateProductValidationSchema(req.body);

        if (error) {
            res.status(400).json({
                message: error.details[0]?.message,
            });
            return;
        }

        const { name, description, slug, images, category } = req.body;
        const { id } = req.params;

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { name, description, slug, images, category },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            res.status(404).json({
                message: "Product not found",
            });
            return;
        }

        res.status(200).json(updatedProduct);
    }
);



export const DeleteProducts = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
        res.status(404).json({
            message: "Product not found",
        });
        return;
    }
    res.status(200).json({
        message: "Product deleted successfully",
    });

});

