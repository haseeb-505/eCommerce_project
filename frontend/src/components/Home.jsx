import React, { useEffect, useState } from "react";
import axiosApi from "../utils/AxiosApi.js";
import { fetchAllProducts, fetchCategories, getProductsByCategories } from "../utils/productServiceApi.js";
import { handleApiCall } from "../utils/handleApiCalls.js";
import { toast, ToastContainer } from "react-toastify";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filtering, setFiltering] = useState(false);

  // handleCheckboxChange
  const handleCheckboxChange = (category) => {
    setSelectedCategories((prevSelected) => {
      const updated = prevSelected.includes(category) ? prevSelected.filter((alreadySelectedCat) => alreadySelectedCat !== category) : [...prevSelected, category]
      if (updated.length === 0) {
        setFiltering(false);
      }
      console.log('Current categories:', updated); // Debug log
      return updated;
    })
  };

  useEffect(() => {
    fetchCategories(setCategories, setLoading);
    fetchAllProducts(setProducts, setLoading);
    // rerender/ or remount the component when selectedCategories change
    // selectedCategories add this in dependency array if you want to
  }, []);

  return (
    <div className=" pt-13 md:pt-18 lg:pt-13 pb-15 bg-slate-700 min-h-[calc(100vh-120px)]">
      <div className="text-center">
        <h1 className="text-xl md:text-3xl bg-green-700 font-medium font-serif mb-2 p-1 border-2 border-white rounded-2xl">Categories</h1>
        <div className="flex justify-center flex-wrap gap-4 mb-6 mt-4 bg-red-500 text-black border-2 border-white rounded-2xl">
          {categories.map((category) => (
            <label key={category} className="flex items-center space-x-2 text-black text-lg">
              <input
                type="checkbox"
                value={category}
                checked={selectedCategories.includes(category)}
                onChange={() => handleCheckboxChange(category)}
                className="form-checkbox h-4 w-4 md:h-5 md:w-5 text-blue-600"
              />
              <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
            </label>
          ))}
        </div>

        <div className="">
          <button 
          className="bg-blue-600 border-gray-600 border-2 p-2 shadow-2xl rounded-lg font-medium hover:bg-blue-500"
          onClick={() => getProductsByCategories(selectedCategories, setFilteredProducts, setLoading, setFiltering)}
          disabled={loading || selectedCategories.length === 0}
          >
            {loading ? 'Filtering...' : 'Filter Products'}
          </button>
        </div>
      </div>

      <div className="bg-slate-700 flex flex-col m-5">
        {loading && (
          <div className="text-white text-2xl">Loading products...</div>
        )}
  
        {filtering ? (
          <div className="filtering">
            <div className="text-xl mb-14 md:text-2xl font-medium text-center bg-blend-normal">
              Filtered Products
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-white text-2xl">No products found for this/these category/categories</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
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
                      <div className="flex flex-row justify-between md:gap-4 lg:justify-between font-medium text-base mt-2">
                        <div className="py-1 px-2 w-fit bg-green-300 rounded-b-md text-gray-700">
                          Off: {product.discount}%
                        </div>
                        <div className="py-1 px-2 w-fit bg-green-100 rounded-b-md text-gray-700">
                          Off Price: $
                          {(product.price - (product.price * product.discount) / 100).toFixed(2)}
                        </div>
                      </div>

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
            )}
          </div>
        ) : (
          <div>
            <div className="text-xl mb-4 md:text-2xl font-medium text-center bg-blend-normal">
              All Products
            </div>
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
                    <div className="flex flex-row justify-between md:gap-4 lg:justify-between font-medium text-base mt-2">
                      <div className="py-1 px-2 w-fit bg-green-300 rounded-b-md text-gray-700">
                        Off: {product.discount}%
                      </div>
                      <div className="py-1 px-2 w-fit bg-green-100 rounded-b-md text-gray-700">
                        Off Price: $
                        {(product.price - (product.price * product.discount) / 100).toFixed(2)}
                      </div>
                    </div>

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
          </div>
        )}
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

export default Home;
