import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import axiosApi from "../utils/AxiosApi.js";

const AddProduct = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      price: "",
      stock: "",
      discount: "",
      productImage: null, // Fixed typo and initialized as null
      category: "",
      tags: [],
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required("please fill this field")
        .min(3, "Title must be of at least 3 characters"),
      description: Yup.string()
        .required("please fill this field")
        .min(10, "Title must be of at least 10 characters")
        .max(50, "Description can't be more than 50 characters"),
      price: Yup.number()
        .required("please fill this field")
        .min(100, "Price shall not be less than 100"),
      stock: Yup.number().required("please fill this field"),
      discount: Yup.number().required("please fill this field"),
      tags: Yup.array(),
      category: Yup.string()
        .required("please fill this field")
        .min(3, "Category must be of at least 3 characters")
        .max(15, "Category can't be more than 15 characters"),
      productImage: Yup.mixed()
        .required("Product image is required")
        .test(
          "fileSize",
          "File too large (max 2MB)",
          (value) => !value || (value && value.size <= 2000000)
        )
        .test(
          "fileType",
          "Unsupported file format",
          (value) =>
            !value ||
            (value &&
              ["image/jpeg", "image/png", "image/webp"].includes(value.type))
        ),
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      // console.log(values);
      // Handle form submission here
      try {
        const formData = new FormData();

        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("price", values.price);
        formData.append("stock", values.stock);
        formData.append("discount", values.discount);
        formData.append("category", values.category);
        formData.append("tags", values.tags);

        if (values.productImage) {
          formData.append("productImage", values.productImage);
        }

        const response = await axiosApi.post(
          "products/create-product",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        if (response.data.success) {
          console.log("Product form data is submitted: ", response.data);
          toast.success("Product added successfully");
          formik.resetForm();
        } else {
          console.error("Error submitting form data:", response.data.message);
          const errorMessage =
            response.data.message || "Product creation failed";
          toast.error(errorMessage);

          // If you want to display errors in form fields:
          if (response.data.errors) {
            const errors = response.data.errors;
            Object.keys(errors).forEach((field) => {
              formik.setFieldError(field, errors[field]);
            });
          }
        }
      } catch (error) {
        if (error.response) {
          toast.error(
            error.response.data.message ||
              error.response.data.error ||
              "Product creation failes"
          );

          // Handle validation errors from backend
          if (error.response.data.errors) {
            const errors = error.response.data.errors;
            Object.keys(errors).forEach((field) => {
              formik.setFieldError(field, errors[field]);
            });
          }
        } else if (error.request) {
          // Request was made but no response received
          toast.error("No response from server. Please try again.");
        } else if (error.request) {
          toast.error("No response from server. Please try again.");
        } else {
          console.log("An Unexpected error occured: ", error);
          toast.error("An unexpected error occurred. ", error);
        }
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleImageChange = (event) => {
    const file = event.currentTarget.files[0];
    formik.setFieldValue("productImage", file);
  };

  return (
    <div className="pt-30 pb-20 bg-slate-700">
      <div className="py-10 px-20 max-w-md mx-auto bg-slate-900 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Add Product</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* title */}
          <div>
            <label className="block text-sm font-medium gray-100">Title*</label>
            <input
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="text"
              className={`mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                formik.errors.title && formik.touched.title
                  ? "border-red-500"
                  : "border"
              }`}
            />
            {formik.errors.title && formik.touched.title && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.title}</p>
            )}
          </div>

          {/* description */}
          <div>
            <label className="block text-sm font-medium text-gray-100">
              Description*
            </label>
            <input
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="text"
              className={`mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                formik.errors.description && formik.touched.description
                  ? "border-red-500"
                  : "border"
              }`}
            />
            {formik.errors.description && formik.touched.description && (
              <p className="mt-1 text-sm text-red-600">
                {formik.errors.description}
              </p>
            )}
          </div>

          {/* price */}
          <div>
            <label className="block text-sm font-medium text-gray-100">
              Price*
            </label>
            <input
              name="price"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="number"
              className={`mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                formik.errors.price && formik.touched.price
                  ? "border-red-500"
                  : "border"
              } pr-10`}
            />
            {formik.errors.price && formik.touched.price && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.price}</p>
            )}
          </div>

          {/* stock */}
          <div>
            <label className="block text-sm font-medium text-gray-100">
              Stock*
            </label>
            <input
              name="stock"
              value={formik.values.stock}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="number"
              className={`mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                formik.errors.stock && formik.touched.stock
                  ? "border-red-500"
                  : "border"
              }`}
            />
            {formik.errors.stock && formik.touched.stock && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.stock}</p>
            )}
          </div>

          {/* Discount */}
          <div>
            <label className="block text-sm font-medium text-gray-100">
              Discount*
            </label>
            <input
              name="discount"
              value={formik.values.discount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="number"
              className={`mt-1 p-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                formik.errors.discount && formik.touched.discount
                  ? "border-red-500"
                  : "border"
              }`}
            />
            {formik.errors.discount && formik.touched.discount && (
              <p className="mt-1 text-sm text-red-600">
                {formik.errors.discount}
              </p>
            )}
          </div>

          {/* productImage */}
          <div>
            <label className="block text-sm font-medium text-gray-100">
              Product Image* (JPEG/PNG, max 2MB)
            </label>
            <input
              name="productImage"
              onChange={handleImageChange}
              onBlur={formik.handleBlur}
              type="file"
              accept="image/jpeg, image/png, image/webp"
              className={`mt-1 p-1 block w-full text-sm text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${
                formik.errors.productImage && formik.touched.productImage
                  ? "border-red-500"
                  : "border"
              }`}
            />
            {formik.errors.productImage && formik.touched.productImage && (
              <p className="mt-1 text-sm text-red-600">
                {formik.errors.productImage}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-100">
              Category*
            </label>
            <input
              name="category"
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="text"
              className={`mt-1 p-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                formik.errors.category && formik.touched.category
                  ? "border-red-500"
                  : "border"
              }`}
            />
            {formik.errors.category && formik.touched.category && (
              <p className="mt-1 text-sm text-red-600">
                {formik.errors.category}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Adding Product..." : "Add Product"}
            </button>
          </div>
        </form>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </div>
  );
};

export default AddProduct;
