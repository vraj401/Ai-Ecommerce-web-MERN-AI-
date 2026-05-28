import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user")) || null;
  const [cartCount, setCartCount] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-5 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <h1 
              onClick={() => navigate("/")}
              className="text-2xl font-bold text-blue-600 cursor-pointer hover:text-blue-700 transition-colors"
            >
              ShopHub
            </h1>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 mx-8">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:border-blue-600 text-sm"
            />
            <button className="px-6 py-2 bg-blue-600 text-white border border-blue-600 rounded-r-lg hover:bg-blue-700 hover:border-blue-800 transition-colors text-sm font-semibold">
              Search
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            {/* Home Link - Hidden if on home */}
            {location.pathname !== "/" && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/");
                }}
                className="px-5 py-2 text-gray-700 font-semibold border border-transparent rounded hover:text-blue-600 hover:bg-blue-50 hover:border-blue-600 transition-colors text-sm pointer-events-auto"
              >
                Home
              </button>
            )}

            {/* Cart Button - Always Visible */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                navigate("/cart");
              }}
              className="relative flex items-center px-5 py-2 text-gray-700 font-semibold border border-transparent rounded hover:text-blue-600 hover:bg-blue-50 hover:border-blue-600 transition-colors text-sm pointer-events-auto"
            >
              <span className="text-lg">🛒</span>
              <span className="ml-1">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Orders Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                navigate("/orders");
              }}
              className="px-5 py-2 text-gray-700 font-semibold border border-transparent rounded hover:text-blue-600 hover:bg-blue-50 hover:border-blue-600 transition-colors text-sm pointer-events-auto"
            >
              Orders
            </button>

            {/* User Section */}
            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col items-end">
                  <p className="text-sm font-semibold text-gray-900">{user.name || "User"}</p>
                  <p className="text-xs text-gray-600">{user.email}</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogout();
                  }}
                  className="px-6 py-2 bg-red-500 text-white border border-red-500 rounded font-semibold hover:bg-red-600 hover:border-red-700 active:bg-red-700 transition-colors text-sm pointer-events-auto"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/login");
                  }}
                  className="px-6 py-2 text-blue-600 font-semibold border border-blue-600 rounded hover:bg-blue-50 hover:border-blue-700 hover:text-blue-700 transition-colors text-sm pointer-events-auto"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/register");
                  }}
                  className="px-6 py-2 bg-blue-600 text-white border border-blue-600 rounded font-semibold hover:bg-blue-700 hover:border-blue-800 active:bg-blue-800 transition-colors text-sm pointer-events-auto"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
