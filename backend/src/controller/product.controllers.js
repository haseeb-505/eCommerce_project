import { Product } from "../models/product.models.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import asyncHandler from "../utils/asyncHandlers.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { User } from "../models/user.models.js";

// create product
const createProduct = asyncHandler( async(req, res) => {
    // get the product information
    const { title, description, price, stock, discount, category, tags } = req.body;
    if ([title, description, price, stock, discount, category].some((field) => field.trim()==="")) {
        console.log("All fields are required")
        return res.status(400)
                .json(
                    new ApiResponse(400, null, "All * fields are required")
                )
    }

    // title needs to unique, means it shall not already be in db
    const titleExists = await Product.findOne({title: title});
    if (titleExists) {
        console.log("Title needs to be unique");
        return res.status(400).json(
            new ApiResponse(400, null, "Title needs to be unique")
        )
    }

    // get the productImage via req.files
    const productImageLocalFile = req.files?.productImage?.[0].path;
    if (!productImageLocalFile) {
        console.log("Avatar is required")
        return res.status(400).json(
                    new ApiResponse(400, null, "Avatar is required")
                )
    }

    // upload the productImage to cloudinary
    const productImage = await uploadToCloudinary(productImageLocalFile );

    if (!productImage) {
        console.log("Server error, ProductImage could not be uploaded to cloudinary")
        return res.status(500).json(
            new ApiResponse(500, null, "Server Error, ProductImage could not be uploaded")
        )
    };

    // create the product in db
    const product = await Product.create({
        title: title.trim(),
        description: description.trim(),
        price: price,
        stock,
        discount,
        productImage: productImage.url,
        category: category.trim(),
        tags: tags,
    });

    // check if user is created successfully
    if (!product) {
        return res.status(500).json( 
            new ApiResponse(500, null, "Error creating product")
        )
    };

    // return the response
    return res.status(201).json(
        new ApiResponse(201, product, "Product created successfully!!!")
    )
});

// get all products
const getAllProducts = asyncHandler(async (req, res) => {
    try {
        // Fetch all products from the database
        const products = await Product.find({});
        
        // Return the products
        return res.status(200).json(
            new ApiResponse(200, products, "All products fetched successfully")
        );
        
    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json(
            new ApiResponse(500, null, "Error fetching products")
        );
    }
});

// get product by title
const getProductByTitle = asyncHandler(async (req, res) => {
    const { title } = req.query;
    const product = await Product.findOne({ title});
    if (!product) {
        console.log("No product with this title found")
        return res.status(404).json(
            new ApiResponse(404, null, "No product with this title found")
        )
    };

    return res.status(200).json(
        new ApiResponse(200, product, "Product found with this title")
    )
});

// get product by tag
const getProductsByTags = asyncHandler(async (req, res) => {
    const { tags } = req.query;

    if (!tags) {
        console.log("Tag needs to be passed")
        return new ApiError(400, "Tag ia not passed")
    }
    
    // tag trim and lowercase
    const tagsArray = tags.trim().toLowerCase();
    const products = await Product.find({ tags: { $in: tagsArray}});
    if (products.length === 0) {
        console.log("There are no products with these tags")
    }

    return res.status(200).json(
        new ApiResponse(200, products, "Success")
    )
});

// get all the categories
const getAllCategories = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find({});
        const categories = [... new Set(products.map((p) => p.category))];

        return res.status(200).json(
            new ApiResponse(200, categories, "Success")
        )
    } catch (error) {
        console.log("Error fetching categories: ", error)
        return res.status(500).json(
            new ApiResponse(500, null, "Error fetching categories")
        )
    }
});

const getProductsByCategory = asyncHandler(async (req, res) => {
    const { category } = req.query;
    if (!category) {
        throw new ApiError(400, "No category passed")
    }

    const products = await Product.find({ category: category.trim()})
    if (!products || products.length === 0) {
        throw new ApiError(403, "No product found for these categories")
    }

    return res.status(200).json(
        new ApiResponse(200, products, "Success")
    )
});

const deleteProductById = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not loggedin")
    }




    const product = await Product.findById(productId);
    if (!product) {
        return ApiError(400, `No product found`)
    }

    if (product.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "This user is not authorized to delete this product")
    }

    await Product.findByIdAndDelete(productId);

    return res.status(200).json(
        new ApiResponse(200, null, `Product has been removed successfully!!`)
    )
});

const updateProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { title, description, price, stock, tags, category} = req.body;
    const { userId } = req.user._id;
    const { thumbnail } = req.file?.path;

    if (!thumbnail) {
        throw new ApiError(400, "Product Image is missing")
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(400, "User not logged in")
    }

    if ([title, description, price, stock, tags, category].some((field) => field.trim() === "")) {
        throw new ApiError(400, "All * fields are must")
    }

    const thumbnailImage = await uploadToCloudinary(thumbnail);
    if (!thumbnailImage) {
        throw new ApiError(400, "Thumbnail could not be uploaded to cloudinary")
    }

    const updateProduct = await Product.findByIdAndUpdate(
        productId,
        {
            $set: {
                title: title,
                description: description,
                stock: stock,
                price: price,
                discount: discount,
                productImage: thumbnail.url,
                category: category,
                tags: tags,
                updatedAt: { type: Date, default: Date.now()}
            }
        },
        { new: true }
    )

    return res.status(200).json(
        new ApiResponse(200, updateProduct, "Product is updated successfully!!")
    )
});


export { 
    createProduct,
    getAllProducts, 
    getProductByTitle,
    getAllCategories, 
    getProductsByTags, 
    getProductsByCategory, 
    deleteProductById,
    updateProduct
};
