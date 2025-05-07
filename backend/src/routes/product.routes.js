import { Router } from "express";
import {
    createProduct, 
    getProductByTitle, 
    getProductsByTags, 
    getProductsByCategory, 
    deleteProductById,
    updateProduct,
} from "../controller/product.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create-products").post(
    upload.fields(
        {
            name: "productImage",
            maxCount: 1,
        }
    ),
    createProduct
);

router.route("/product-by-title").get(getProductByTitle);
router.route("/products-by-tags").get(getProductsByTags);
router.route("/products-by-category").get(getProductsByCategory);
router.route("/update-product").put(verifyJWT, upload.fields(
    {
        name: "productImage",
        maxCount: 1,
    }
), updateProduct);
router.route("/delete-product").delete(verifyJWT, deleteProductById);


export default router;

