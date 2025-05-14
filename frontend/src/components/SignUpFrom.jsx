import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { Link } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/solid";
import axiosApi from "../utils/AxiosApi.js";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../redux/authentication/authApiSlice.js"; // update path as needed

// Validation schema
const schema = yup.object().shape({
  username: yup.string().required("Username is required").min(3),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  fullName: yup.string().required("Full name is required"),
  avatar: yup
    .mixed()
    .test(
      "required",
      "Avatar is required",
      (value) => value && value.length > 0
    )
    .test("fileSize", "File too large (max 2MB)", (value) => {
      if (!value.length) return true; // Skip if no file
      return value[0].size <= 2000000;
    })
    .test("fileType", "Unsupported file format", (value) => {
      if (!value.length) return true; // Skip if no file
      return ["image/jpeg", "image/png", "image/webp"].includes(value[0].type);
    }),
  coverPhoto: yup
    .mixed()
    .test("fileSize", "File too large (max 5MB)", (value) => {
      if (!value || !value.length) return true; // Optional field
      return value[0].size <= 5000000;
    })
    .test("fileType", "Unsupported file format", (value) => {
      if (!value || !value.length) return true; // Optional field
      return ["image/jpeg", "image/png", "image/webp"].includes(value[0].type);
    }),
  phone: yup.string().matches(/^[0-9]{10}$/, "Invalid phone number"),
  address: yup.string(),
  role: yup.string().oneOf(["user", "admin"], "Invalid role").default("user"),
});

const SignupForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      role: "user",
    },
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [registerUser, { isLoading: isSubmitting }] = useRegisterMutation();

  const onSubmit = async (data) => {
    // setIsSubmitting(true);
    try {
      // Create FormData for file uploads
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "avatar" || key === "coverPhoto") {
          if (value && value.length > 0) {
            formData.append(key, value[0]);
          }
        } else {
          formData.append(key, value);
        }
      });

      const response = await registerUser(formData).unwrap();
      // console.log("response is: ", response)

      // Check for success in different possible response structures
      if (response.success || response.data?.success) {
        toast.success("Signup successful! Redirecting...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        const errorMsg =
          response.message || response.data?.message || "Signup failed";
        toast.error(errorMsg);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Signup failes");
      } else if (error.request) {
        toast.error("No response from server. Please try again.");
      } else {
        console.log("An unexpected error occurred. ", error);
        toast.error("An unexpected error occurred. ", error);
      }
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverPhotoPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-slate-900 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Username */}
        <div>
          <label className="block text-sm font-medium gray-100">
            Username*
          </label>
          <input
            {...register("username")}
            type="text"
            className={`mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.username ? "border-red-500" : "border"
            }`}
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-100">
            Email*
          </label>
          <input
            {...register("email")}
            type="email"
            className={`mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.email ? "border-red-500" : "border"
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-100">
            Password*
          </label>
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              className={`mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                errors.password ? "border-red-500" : "border"
              } pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOffIcon className="h-5 w-5 text-gray-400" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-100">
            Full Name*
          </label>
          <input
            {...register("fullName")}
            type="text"
            className={`mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.fullName ? "border-red-500" : "border"
            }`}
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Avatar */}
        <div>
          <label className="block text-sm font-medium text-gray-100">
            Avatar* (JPEG/PNG, max 2MB)
          </label>
          <input
            {...register("avatar")}
            type="file"
            accept="image/jpeg, image/png, image/webp"
            onChange={handleAvatarChange}
            className={`mt-1 p-1 block w-full text-sm text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${
              errors.avatar ? "border-red-500" : "border"
            }`}
          />
          {errors.avatar && (
            <p className="mt-1 text-sm text-red-600">{errors.avatar.message}</p>
          )}
          {avatarPreview && (
            <div className="mt-2">
              <img
                src={avatarPreview}
                alt="Avatar preview"
                className="h-20 w-20 rounded-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Cover Photo */}
        <div>
          <label className="block text-sm font-medium text-gray-100">
            Cover Photo (Optional, JPEG/PNG, max 5MB)
          </label>
          <input
            {...register("coverPhoto")}
            type="file"
            accept="image/jpeg, image/png, image/webp"
            onChange={handleCoverPhotoChange}
            className="mt-1 p-1 block w-full text-sm text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {coverPhotoPreview && (
            <div className="mt-2">
              <img
                src={coverPhotoPreview}
                alt="Cover photo preview"
                className="h-32 w-full rounded-md object-cover"
              />
            </div>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-100">
            Phone
          </label>
          <input
            {...register("phone")}
            type="tel"
            className="mt-1 p-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="1234567890"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-100">
            Address
          </label>
          <textarea
            {...register("address")}
            rows={2}
            className="mt-1 p-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Role (hidden if not needed) */}
        <div className="hidden">
          <label className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            {...register("role")}
            className="mt-1 p-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Signing up..." : "Sign Up"}
          </button>
        </div>
      </form>
      {/* Sign Up Link */}
      <div className="mt-4 text-center text-sm">
        <span className="text-gray-200">Already have an account? </span>
        <Link
          to="/login"
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Login
        </Link>
      </div>
      {/* toast container here */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
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

export default SignupForm;
