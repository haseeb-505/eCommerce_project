// this file will handle the all the api calls related to products
// get products, post products, update products, getCategories etc

// I have made a copy of this function in other file, for any further usage,
// we'll import it from there, 
// I am keeping it here just to understand the flow of this functionality and 
// how do we integrate it actual calls

import axiosApi from './AxiosApi.js';
import { toast } from 'react-toastify';

const handleApiCall = async (apiFn, onSuccess, setLoading) => {
    try {
        setLoading && setLoading(true);

        const response = await apiFn();

        if (response.data.success) {
            onSuccess(response.data.data);
            toast.success("Data fetchend successfully!!");
        } else {
            toast.error(response.data.message || "Something went wrong")
        }
    } catch (error) {
        if (error.response) {
            toast.error(error.response.data.message || "Server error");
          } else if (error.request) {
            toast.error("No response from server");
          } else {
            toast.error("Unexpected error");
          }
    } finally {
        setLoading && setLoading(false);
      }
};

// we use this functions as a wraper to our apiCalls, 
export const fetchAllProducts = (onSuccess, setLoading) => (
    handleApiCall(() => axiosApi.get("/products/all-products"), onSuccess, setLoading)
);

export const fetchCategories = (onSuccess, setLoading) => (
    handleApiCall(() => axiosApi.get("/products/products-category"), onSuccess, setLoading)
);

// what is confusing here is the onSuccess call back function, 
// because setLoading callback is kind of clear that it will update some loading state
// onSuccess will be clear from next line which is used in frontend

// useEffect(() => {
//     fetchCategories(setCategories, setLoading);
//     fetchAllProducts(setProducts, setLoading);
//   }, [selectedCategories]);

// so here onSuccess function is equal to setCategories or setProducts in fetchCat or fetchAll...
// means we are using onSuccess function to update the categories array with the data
// we recieve from onSuccess(response.data.data)
// so this data is being basically passed to setCategoreis and setProducts
// we did not passed these direclty because for some later on purpose,we may want to use some other onSuccess callback





