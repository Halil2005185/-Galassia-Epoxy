import type { Request, Response } from "express";
import Product, { productValidationSchema, productListQuerySchema, UpdateProductValidationSchema, type IProductImage } from "../model/Product.js";
import asyncHandler from "express-async-handler";
import type { } from "multer";
import { deleteFile, uploadFile } from "../config/r2.js";

// multipart/form-data (required for file uploads) can only carry flat string
// fields, so the client JSON-stringifies the localized `name`/`description`
// objects. Parse them back before they reach Joi/Mongoose. A plain JSON
// request (no files) already has real objects here, so this is a no-op then.
// Returns an error message on malformed JSON, or null on success.
// Keeps R2 object keys (and therefore the public URLs built from them)
// free of spaces and other characters that are awkward in a URL, even
// though S3/R2 itself would accept them in a key.
function sanitizeFilename(name: string): string {
    return name.replace(/[^a-zA-Z0-9.-]+/g, "-");
}

function parseLocalizedFields(body: Record<string, unknown>): string | null {
    for (const field of ["name", "description"] as const) {
        if (typeof body[field] === "string") {
            try {
                body[field] = JSON.parse(body[field] as string);
            } catch {
                return `Invalid JSON in "${field}" field.`;
            }
        }
    }
    return null;
}

export const GetProducts = asyncHandler(
    async (req: Request, res: Response) => {
        const { error, value } = productListQuerySchema(req.query);

        if (error) {
            res.status(400).json({ message: error.details[0]?.message });
            return;
        }

        const { page, limit } = value as { page: number; limit: number };

        const [products, total] = await Promise.all([
            Product.find()
                .populate("category")
                .skip((page - 1) * limit)
                .limit(limit),
            Product.countDocuments(),
        ]);

        res.status(200).json({
            products,
            total,
            page,
            pages: Math.ceil(total / limit),
        });
    }
);

export const GetProductBySlug = asyncHandler(
    async (req: Request, res: Response) => {
        const slug = String(req.params.slug ?? "");

        const product = await Product.findOne({ slug }).populate("category");

        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }

        res.status(200).json(product);
    }
);


export const AddProducts = asyncHandler(async (req: Request, res: Response) => {
    const parseError = parseLocalizedFields(req.body);
    if (parseError) {
        res.status(400).json({ message: parseError });
        return;
    }

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
                `products/${Date.now()}-${sanitizeFilename(file.originalname)}`,
                file.mimetype
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
        const parseError = parseLocalizedFields(req.body);
        if (parseError) {
            res.status(400).json({ message: parseError });
            return;
        }

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
                        `products/${Date.now()}-${sanitizeFilename(file.originalname)}`,
                        file.mimetype
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

    await Promise.all(
        deletedProduct.images.map((image) => deleteFile(image.key))
    );

    res.status(200).json({
        message: "Product deleted successfully",
    });

});

