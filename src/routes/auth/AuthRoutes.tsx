import { Route, Routes } from "react-router-dom";
import React from "react";
import SignIn from "../../views/auth/sign-in/SignIn";
import SignUp from "../../views/auth/sign-up/SignUp";
import SignOut from "../../views/auth/sign-out/SignOut";
import Error from "../../pages/errors/Error";

function AuthRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/sign-out" element={<SignOut />} />

      {/* ERROR */}
      <Route
        path="*"
        element={<Error error={{ message: "Page not found" }} />}
      />
    </Routes>
  );
}

export default AuthRoutes;
