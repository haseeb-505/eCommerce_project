import React, { useEffect, useState } from "react";
import axiosApi from "../utils/AxiosApi.js";
import { toast, ToastContainer } from "react-toastify";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getProducts = async () => {
    try {
      setLoading(true);
      const response = await axiosApi.get("/products/all-products");
      if (response.data.success) {
        setProducts(response.data.data);
        console.log("Productes fetched successfully!!", response.data.data);
        toast.success("Productes fetched successfully!!");
        setLoading(false);
      } else {
        console.error("Error submitting form data:", response.data.message);
        const errorMessage = response.data.message || "Product fetching failed";
        toast.error(errorMessage);
      }
    } catch (error) {
      if (error.response) {
        toast.error(
          error.response.data.message ||
            error.response.data.error ||
            "Product fetching failes"
        );
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
      setLoading(false)
    }
  };

  useEffect(() => {
    getProducts()
  }, []);

  return (
    <div className="bg-slate-700 flex flex-col m-5">
      {loading && (
        <div className="text-white text-2xl">Loading products...</div>
      )}
      {products.length === 0 && (
        <div className="text-white text-2xl">No products found</div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id || product.id}
            className="rounded overflow-hidden shadow-lg border-white border-2 shadow-white hover:shadow-xl hover:shadow-blue-500/50 transition-shadow duration-300"
          >
            <div className="relative w-full h-48 rounded-t-md overflow-hidden">
              <img
                className="w-full h-full object-contain"
                src={product.productImage}
                alt={product.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/placeholder-product.jpg";
                }}
              />
            </div>

            <div className="px-6 pt-1">
              <div className="font-bold text-xl mb-2 text-center text-white">
                {product.title}
              </div>
              <p className="text-gray-100 text-base">{product.description}</p>
              <div className="flex flex-row justify-between md:gap-4 lg:justify-between font-bold text-base mt-2">
                <div className="py-1 px-2 w-fit bg-gray-100 rounded-b-md text-gray-700">
                  Category: {product.category}
                </div>
                <div className="py-1 px-2 w-fit bg-gray-100 rounded-b-md text-gray-700">
                  Price: ${product.price}
                </div>
              </div>
              {/* discount and price after discount */}
              <div className="flex flex-row justify-between md:gap-4 lg:justify-between font-medium text-base mt-2">
                <div className="py-1 px-2 w-fit bg-green-300 rounded-b-md text-gray-700">
                  Off: {product.discount}%
                </div>
                <div className="py-1 px-2 w-fit bg-green-100 rounded-b-md text-gray-700">
                  Off Price: $
                  {product.price - (product.price * product.discount) / 100}
                </div>
              </div>

              {/* Add to cart option */}
              <div className="px-6 pt-4 pb-2 text-center">
                <button
                  type="button"
                  className="bg-blue-600 font-medium rounded-lg p-2 hover:cursor-pointer hover:bg-blue-400 hover:text-black"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
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
  );
};

export default Products;
