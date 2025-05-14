import { Outlet, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useRefreshMutation } from "../redux/authentication/authApiSlice.js";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../redux/authentication/authSlice.js";

const PersistLogin = () => {
  const token = useSelector(selectCurrentToken);
  console.log("Token in persistlogin is: ", token);
  const effectRan = useRef(false);
  const [trueSuccess, setTrueSuccess] = useState(false);

  const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] =
    useRefreshMutation();

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== "development") {
      const verifyRefreshToken = async () => {
        console.log("\n\nverifying refresh token");
        try {
          const data = await refresh().unwrap();
          console.log("Data in verifyRefreshToken is: ", data)
          setTrueSuccess(true);
        } catch (err) {
          console.error(err);
        }
      };

      if (!token) verifyRefreshToken();
    }

    return () => (effectRan.current = true);
  }, []);

  let content;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isError) {
    content = (
      <p className="errmsg">
        {error?.data?.message || "Session expired"}
        <Link to="/login">Please login again</Link>.
      </p>
    );
  } else if (isSuccess && trueSuccess) {
    content = <Outlet />;
  } else if (token && isUninitialized) {
    content = <Outlet />;
  }

  return content;
};

export default PersistLogin;
