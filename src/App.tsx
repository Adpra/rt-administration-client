import { Navigate, Route, Routes } from "react-router-dom";
import React from "react";
import Error from "./pages/errors/Error";
import AuthRoutes from "./routes/auth/AuthRoutes";
import AdminRoutes from "./routes/admin/AdminRoutes";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="/auth/*" element={<AuthRoutes />} />
      <Route path="/admin/*" element={<AdminRoutes />} />

      {/* ERROR */}
      <Route
        path="*"
        element={<Error error={{ message: "Page not found" }} />}
      />
    </Routes>
  );
}

export default App;
