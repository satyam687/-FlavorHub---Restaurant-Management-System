import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Menu, X, ShoppingCart, User, LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">FH</span>
            </div>
            <span className="text-xl font-bold text-gray-900">FlavorHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Home
            </Link>
            <Link to="/menu" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Menu
            </Link>
            {isAuthenticated && (
              <Link to="/order-tracking" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
                My Orders
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" className="text-gray-700 hover:text-primary-600 transition-colors font-medium flex items-center gap-1">
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="relative text-gray-700 hover:text-primary-600 transition-colors">
                  <ShoppingCart size={24} />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
                <div className="flex items-center space-x-2 text-gray-700">
                  <User size={18} />
                  <span className="font-medium">{user?.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            {isAuthenticated && (
              <Link to="/cart" className="relative text-gray-700">
                <ShoppingCart size={24} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100">
            <div className="flex flex-col space-y-3 pt-4">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-primary-600 font-medium px-2 py-1">
                Home
              </Link>
              <Link to="/menu" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-primary-600 font-medium px-2 py-1">
                Menu
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to="/order-tracking" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-primary-600 font-medium px-2 py-1">
                    My Orders
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-primary-600 font-medium px-2 py-1">
                      Dashboard
                    </Link>
                  )}
                  <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-primary-600 font-medium px-2 py-1">
                    Cart ({totalItems})
                  </Link>
                  <button onClick={handleLogout} className="text-left text-gray-700 hover:text-primary-600 font-medium px-2 py-1">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-primary-600 font-medium px-2 py-1">
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)} className="text-primary-600 font-medium px-2 py-1">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
