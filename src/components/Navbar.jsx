import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Film, Tv, BookmarkCheck, Home, Ghost, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationLinks = [
      { name: 'Home', path: '/', icon: Home },
      { name: 'Movies', path: '/movies', icon: Film },
      { name: 'Watchlist', path: '/watchlist', icon: BookmarkCheck, protected: true },
      { name: 'Chat', path: '/chat', icon: MessageCircle, protected: true },
  ];

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <nav 
      className={`sticky top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/90 backdrop-blur-sm' : 'bg-gradient-to-b from-black to-transparent'
      }`}
    >

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-red-500 font-bold text-2xl hover:text-red-400 transition-colors group"
            >
              <Ghost className="w-6 h-6 group-hover:animate-pulse" />
              <span className="">HORROR APP</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center justify-center grow md:space-x-6">
            {navigationLinks.map((link) => (
              (!link.protected || (link.protected && user)) && (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center px-2 rounded-md text-md font-medium transition-all 
                    ${isActivePath(link.path)
                      ? 'text-red-500 bg-red-900/20'
                      : 'text-gray-300 hover:text-red-500 hover:bg-red-900/10'
                    }`}
                >
                  <link.icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              )
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-300">{user.username}</span>
                <button
                  onClick={logout}
                  className="text-gray-300 hover:text-red-500 px-3 py-2 rounded-md text-sm font-medium 
                    transition-all hover:bg-red-900/10"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-red-600 text-white text-center w-24 px-4 py-2 rounded-md text-sm font-medium 
                  transition-all hover:bg-red-700 hover:scale-105 hover:shadow-lg hover:shadow-red-600/20"
              >
                Login

              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-red-500 p-2 rounded-md transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-sm border-t border-red-900/50">
          <div className="px-2 pt-2 pb-3 space-y-4">
            {navigationLinks.map((link) => (
              (!link.protected || (link.protected && user)) && (
                <Link

                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 my-4 px-3 py-2 rounded-md text-base font-medium transition-colors
                    ${isActivePath(link.path)
                      ? 'text-red-500 bg-red-900/20'
                      : 'text-gray-300 hover:text-red-500 hover:bg-red-900/10'
                    }`}
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.name}</span>
                </Link>
              )
            ))}
            
            {/* Mobile User Menu */}
            {user ? (
              <div className="pt-4 pb-3 border-t border-red-900/30">
                <div className="px-3 py-2">
                  <span className="text-gray-300 block">{user.username}</span>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="mt-2 text-gray-300 hover:text-red-500 block w-full text-left px-3 py-2 
                      rounded-md text-base font-medium transition-colors hover:bg-red-900/10"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block mx-2 mt-4 text-center bg-red-600 text-white px-4 py-2 rounded-md 
                  text-base font-medium transition-all hover:bg-red-700"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;