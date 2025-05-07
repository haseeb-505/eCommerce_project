import { Router } from "express";
import {
    createProduct, 
    getProductByTitle, 
    getProductsByTags, 
    getProductsByCategory, 
    deleteProductByTitle
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
router.route("/delete-product").put(upload.fields(
    {
        name: "productImage",
        maxCount: 1,
    }
), deleteProductByTitle);
router.route("/delete-product").delete(deleteProductByTitle);




