import type { Request, Response } from "express";
import Product, { productValidationSchema, UpdateProductValidationSchema } from "../model/Product.js";
import asyncHandler from "express-async-handler";
import type { } from "multer";
import { deleteFile, uploadFile } from "../config/r2.js";
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

    const { name, description, slug, category } = req.body;

    const files = req.files as Express.Multer.File[];

 const images = await Promise.all(
  files.map((file) =>
    uploadFile(
      file.buffer,
      `products/${Date.now()}-${file.originalname}`
    )
  )
);
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

        const { name, description, slug, category } = req.body;
        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            res.status(404).json({
                message: "Product not found",
            });
            return;
        }

        const files = (req.files as Express.Multer.File[]) || [];

        let images: IProductImage[] | undefined;

        if (files.length > 0) {
            images = await Promise.all(
                files.map((file) =>
                    uploadFile(
                        file.buffer,
                        `products/${Date.now()}-${file.originalname}`
                    )
                )
            );
        }

        const oldImages = product.images;

        product.name = name;
        product.description = description;
        product.slug = slug;
        product.category = category;

        if (images) {
            product.images = images;
        }

        await product.save();

        if (images) {
            await Promise.all(
                oldImages.map((image) => deleteFile(image.key))
            );
        }

        res.status(200).json(product);
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

