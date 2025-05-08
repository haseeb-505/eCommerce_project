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

export { handleApiCall };