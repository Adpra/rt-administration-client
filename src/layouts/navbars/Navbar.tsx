import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar bg-base-700 shadow-sm">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          Home
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/admin/house" className="btn btn-ghost">
              House
            </Link>
          </li>
          <li>
            <Link to="/admin/house-holders" className="btn btn-ghost">
              Resident
            </Link>
          </li>
          <li>
            <Link to="/admin/billings" className="btn btn-ghost">
              Billing
            </Link>
          </li>
          <li>
            <Link to="/" className="btn btn-ghost">
              Transaction
            </Link>
          </li>
          <li>
            <Link to="/" className="btn btn-ghost">
              Finance
            </Link>
          </li>
          <li>
            <Link to="/" className="btn btn-ghost">
              User
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
