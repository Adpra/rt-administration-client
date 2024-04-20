import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar bg-base-100 bg-base-100 shadow-sm">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          Home
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
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
