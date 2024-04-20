import { Route, Routes, Navigate } from "react-router-dom";
import React from "react";
import Home from "../../views/Home";
import Page from "../../views/Page";
import Error from "../../pages/errors/Error";

function AdminRoutes() {
  const isAuthenticated = () => {
    const accessToken = localStorage.getItem("access_token");
    return !!accessToken;
  };

  return isAuthenticated() ? (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/page" element={<Page />} />

      {/* ERROR */}
      <Route
        path="*"
        element={<Error error={{ message: "Page not found" }} />}
      />
    </Routes>
  ) : (
    <Navigate to="/auth/sign-in" replace />
  );
}

export default AdminRoutes;
