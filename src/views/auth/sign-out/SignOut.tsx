import React from "react";
import { Navigate } from "react-router-dom";

const SignOut = () => {
  const removeToken = () => {
    localStorage.removeItem("access_token");
  };

  removeToken();
  return <Navigate to="/auth/sign-in" replace />;
};

export default SignOut;
