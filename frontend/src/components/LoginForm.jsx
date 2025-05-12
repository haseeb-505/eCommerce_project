import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";
import { useLoginUserMutation } from "../redux/authentication/authApi.js";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo } from "../redux/authentication/authSlice";
import authApi from "../redux/authentication/authApi.js";

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm();
  const dispatch = useDispatch();
  const [loginUser, {isLoading }] = useLoginUserMutation();
  const { isAuthenticated } = useSelector(state => state.auth)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate])


  const onSubmit = async (data) => {
    try {
      const res = await loginUser(data).unwrap();
      
      if (res.success || res.data.success) {
        // console.log("Login response is: ", res);
        dispatch(setUserInfo({
          user: res.data?.user || res.data?.data?.user,
          // token: res.data.data.token,
          isAuthenticated: true
        }));

        toast.success("Login successful!");

        // Redirect to intended page or home
        navigate("/");
      } else {
        toast.error(res.data.message || "Invalid email or password");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-slate-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">Welcome Back</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Email or username*
          </label>
          <input
            {...register("loginId", { 
              required: "Email or username is required",
              
            })}
            type="text"
            className={`w-full px-4 py-2 rounded-md border bg-slate-700 text-white ${
              errors.loginId ? "border-red-500" : "border-slate-600"
            }`}
            placeholder="email or username"
          />
          {errors.loginId && (
            <p className="mt-1 text-sm text-red-400">{errors.loginId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Password*
          </label>
          <input
            {...register("password", { 
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters"
              }
            })}
            type="password"
            className={`w-full px-4 py-2 rounded-md border bg-slate-700 text-white ${
              errors.password ? "border-red-500" : "border-slate-600"
            }`}
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-gray-400">
        <p>
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-blue-400 hover:text-blue-300">
  Sign up
</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;