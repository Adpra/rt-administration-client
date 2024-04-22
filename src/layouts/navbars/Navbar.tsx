import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";

const Navbar = () => {
  const params = useParams();
  const param = params["*"];

  return (
    <nav className="navbar bg-base-700 shadow-sm">
      <div className="flex-1">
        <Link to="/admin/house" className="btn btn-ghost normal-case text-xl">
          Home
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link
              to="/admin/house"
              className={`btn btn-ghost ${
                param === "house" ? "btn-active" : ""
              }`}
            >
              House
            </Link>
          </li>
          <li>
            <Link
              to="/admin/house-holders"
              className={`btn btn-ghost ${
                param === "house-holders" ? "btn-active" : ""
              }`}
            >
              Resident
            </Link>
          </li>
          <li>
            <Link
              to="/admin/billings"
              className={`btn btn-ghost ${
                param === "billings" ? "btn-active" : ""
              }`}
            >
              Billing
            </Link>
          </li>
          <li>
            <Link
              to="/admin/transaction-histories"
              className={`btn btn-ghost ${
                param === "transaction-histories" ? "btn-active" : ""
              }`}
            >
              Transaction
            </Link>
          </li>
          <li>
            <Link
              to="/admin/finances"
              className={`btn btn-ghost ${
                param === "finance" ? "btn-active" : ""
              }`}
            >
              Finance
            </Link>
          </li>
          <li>
            <Link to="/auth/sign-out" className="btn btn-ghost">
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
