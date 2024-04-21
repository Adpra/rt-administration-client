import { Route, Routes, Navigate } from "react-router-dom";
import React from "react";
import Home from "../../views/Home";
import Page from "../../views/Page";
import Error from "../../pages/errors/Error";
import House from "../../views/house/House";
import HouseForm from "../../views/house/HouseForm";
import HouseDetail from "../../views/house/HouseDetail";

function AdminRoutes() {
  const isAuthenticated = () => {
    const accessToken = localStorage.getItem("access_token");
    return !!accessToken;
  };

  return isAuthenticated() ? (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/page" element={<Page />} />

      {/* HOUSE  */}
      <Route path="/house" element={<House />} />
      <Route path="/add-house" element={<HouseForm />} />
      <Route path="/edit-house/:id" element={<HouseForm />} />
      <Route path="/house/:id" element={<HouseDetail />} />

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
