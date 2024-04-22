import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";

const Navbar = () => {
  const params = useParams();
  const param = params["*"];
  const accessToken = localStorage.getItem("access_token");

  const navLinks = useMemo(() => {
    return [
      { to: "/admin/house", label: "House", param: "house" },
      { to: "/admin/house-holders", label: "Resident", param: "house-holders" },
      { to: "/admin/billings", label: "Billing", param: "billings" },
      {
        to: "/admin/transaction-histories",
        label: "Transaction",
        param: "transaction-histories",
      },
      { to: "/admin/finances", label: "Finance", param: "finance" },
    ];
  }, []);

  return (
    <nav className="navbar bg-slate-600 shadow-sm text-white">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          Home
        </Link>
      </div>
      {accessToken && (
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            {navLinks.map((link, index) => (
              <li key={index}>
                <Link
                  to={link.to}
                  className={`btn btn-ghost ${
                    param === link.param ? "btn-active" : ""
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/auth/sign-out" className="btn btn-ghost">
                Logout
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
