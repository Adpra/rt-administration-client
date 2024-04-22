import { Route, Routes, Navigate } from "react-router-dom";
import React from "react";
import Error from "../../pages/errors/Error";
import House from "../../views/houses/House";
import HouseForm from "../../views/houses/HouseForm";
import HouseDetail from "../../views/houses/HouseDetail";
import HouseHolder from "../../views/house-holders/HouseHolder";
import HouseHolderForm from "../../views/house-holders/HouseHolderForm";
import Billing from "../../views/billings/Billing";
import BillingForm from "../../views/billings/BillingForm";
import TransactionPay from "../../views/transactions/TransactionPay";
import TransactionHistory from "../../views/transactions/TransactionHistory";
import TransactionExpenditure from "../../views/transactions/TransactionExpenditure";
import useCurrentUser from "../../utils/CurrentUser";
import Finance from "../../views/finances/Finance";

function AdminRoutes() {
  const isAuthenticated = () => {
    const accessToken = localStorage.getItem("access_token");
    return !!accessToken;
  };

  return isAuthenticated() ? (
    <Routes>
      {/* HOUSE  */}
      <Route path="/house" element={<House />} />
      <Route path="/add-house" element={<HouseForm />} />
      <Route path="/edit-house/:id" element={<HouseForm />} />
      <Route path="/house/:id" element={<HouseDetail />} />

      {/* HOUSE HOLDERS */}
      <Route path="/house-holders" element={<HouseHolder />} />
      <Route path="/add-house-holder" element={<HouseHolderForm />} />
      <Route path="/edit-house-holder/:id" element={<HouseHolderForm />} />

      {/* Billings */}
      <Route path="/billings" element={<Billing />} />
      <Route path="/add-billing" element={<BillingForm />} />
      {/* <Route path="/edit-billing/:id" element={<BillingForm />} /> */}

      {/* Transaction */}
      <Route path="/transaction-pay/:id" element={<TransactionPay />} />
      <Route path="/transaction-histories" element={<TransactionHistory />} />
      <Route path="/add-transaction" element={<TransactionExpenditure />} />

      {/* Finance */}
      <Route path="/finances" element={<Finance />} />

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
