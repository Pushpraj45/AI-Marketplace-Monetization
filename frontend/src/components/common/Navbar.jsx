import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // eslint-disable-next-line no-unused-vars
  const [previousPath, setPreviousPath] = useState("/");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track route changes to highlight active nav link
  useEffect(() => {
    setPreviousPath(location.pathname);
  }, [location.pathname]);

  // Add scroll effect to navbar
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsProfileOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  // Dropdown animation
  const dropdownVariants = {
    hidden: { 
      opacity: 0, 
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.2
      } 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        duration: 0.3
      }
    },
    exit: { 
      opacity: 0, 
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.2
      } 
    }
  };

  // Mobile menu animation
  const mobileMenuVariants = {
    hidden: { 
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.2
      }
    },
    visible: { 
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05,
        delayChildren: 0.05
      }
    },
    exit: { 
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  // Hamburger button animation
  const lineVariants = {
    closed: { rotate: 0, y: 0 },
    open: (custom) => {
      switch (custom) {
        case 1:
          return { rotate: 45, y: 6 };
        case 2:
          return { opacity: 0 };
        case 3:
          return { rotate: -45, y: -6 };
        default:
          return {};
      }
    }
  };

  // Check if a nav link is active
  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  // Logo animation
  const logoVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-sm ${scrolled ? "bg-white/90 shadow-lg py-2" : "bg-white/95 py-4"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <motion.div
                initial="initial"
                whileHover="hover"
                variants={logoVariants}
              >
                <Link to="/" className="text-xl font-bold text-primary-600 flex items-center group">
                  <motion.span 
                    className="mr-2 text-2xl bg-primary-50 p-2 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-300"
                    whileHover={{ rotate: [0, -10, 10, -5, 0], transition: { duration: 0.5 } }}
                  >
                    🧠
                  </motion.span> 
                  <span className="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                    MonetizeAI
                  </span>
                </Link>
              </motion.div>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <NavLink path="/" label="Home" isActive={isActive("/")} />

              {currentUser && (
                <NavLink path="/dashboard" label="Dashboard" isActive={isActive("/dashboard")} />
              )}

              {currentUser?.role === "developer" && (
                <NavLink path="/models" label="My Models" isActive={isActive("/models")} />
              )}

              {currentUser && (
                <NavLink path="/marketplace" label="AI Marketplace" isActive={isActive("/marketplace")} />
              )}

              {currentUser && (
                <NavLink path="/models/published" label="Published Models" isActive={isActive("/models/published")} />
              )}
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {currentUser ? (
              <div className="ml-3 relative">
                <div>
                  <motion.button
                    onClick={toggleProfile}
                    className="bg-primary-50 rounded-full flex text-sm ring-2 ring-white hover:ring-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 overflow-hidden transition-all duration-300"
                    id="user-menu"
                    aria-expanded="false"
                    aria-haspopup="true"
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="sr-only">Open user menu</span>
                    <motion.div 
                      className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-100 to-blue-100 flex items-center justify-center shadow-inner"
                      whileHover={{ 
                        backgroundColor: "#e0f2fe",
                        transition: { duration: 0.3 } 
                      }}
                    >
                      <span className="text-primary-800 font-semibold text-sm">
                        {(
                          currentUser.profile?.name ||
                          currentUser.email ||
                          "User"
                        )
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    </motion.div>
                  </motion.button>
                </div>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-100"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu"
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <div className="px-4 py-3 text-sm text-gray-700 border-b bg-gray-50 rounded-t-lg">
                        <p className="font-medium">
                          {currentUser.profile?.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {currentUser.email}
                        </p>
                      </div>

                      {currentUser.role === "user" && (
                        <ProfileLink to="/user-profile" label="Your Profile" onClick={() => setIsProfileOpen(false)} />
                      )}

                      {currentUser.role === "developer" && (
                        <ProfileLink to="/dev-profile" label="Developer Profile" onClick={() => setIsProfileOpen(false)} />
                      )}

                      <ProfileLink to="/dashboard" label="Dashboard" onClick={() => setIsProfileOpen(false)} />

                      <button
                        onClick={handleLogout}
                        className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 rounded-b-lg"
                        role="menuitem"
                      >
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="space-x-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/login"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200 shadow-sm"
                  >
                    Log in
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/register"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                  >
                    Register
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <motion.button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-primary-500 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-all duration-300"
              aria-expanded="false"
              initial={false}
              animate={isMenuOpen ? "open" : "closed"}
            >
              <span className="sr-only">Open main menu</span>
              <div className="w-6 h-6 flex flex-col justify-around">
                <motion.div
                  custom={1}
                  variants={lineVariants}
                  className="w-6 h-1 bg-gray-400 rounded-full"
                />
                <motion.div
                  custom={2}
                  variants={lineVariants}
                  className="w-6 h-1 bg-gray-400 rounded-full"
                />
                <motion.div
                  custom={3}
                  variants={lineVariants}
                  className="w-6 h-1 bg-gray-400 rounded-full"
                />
              </div>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="sm:hidden overflow-hidden bg-white/95 backdrop-blur-sm shadow-inner"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="pt-2 pb-3 space-y-1">
              <MobileNavLink path="/" label="Home" isActive={isActive("/")} onClick={() => setIsMenuOpen(false)} />

              {currentUser && (
                <MobileNavLink path="/dashboard" label="Dashboard" isActive={isActive("/dashboard")} onClick={() => setIsMenuOpen(false)} />
              )}

              {currentUser?.role === "developer" && (
                <MobileNavLink path="/models" label="My Models" isActive={isActive("/models")} onClick={() => setIsMenuOpen(false)} />
              )}

              {currentUser && (
                <MobileNavLink path="/marketplace" label="AI Marketplace" isActive={isActive("/marketplace")} onClick={() => setIsMenuOpen(false)} />
              )}

              {currentUser && (
                <MobileNavLink path="/models/published" label="Published Models" isActive={isActive("/models/published")} onClick={() => setIsMenuOpen(false)} />
              )}
            </div>

            {!currentUser && (
              <div className="pt-4 pb-5 border-t border-gray-200">
                <div className="flex flex-col items-center space-y-3 px-4">
                  <Link
                    to="/login"
                    className="w-full bg-primary-50 hover:bg-primary-100 text-primary-700 flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-md text-base font-medium transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              </div>
            )}

            {currentUser && (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-100 to-blue-100 flex items-center justify-center shadow-sm">
                      <span className="text-primary-800 font-semibold text-sm">
                        {(
                          currentUser.profile?.name ||
                          currentUser.email ||
                          "User"
                        )
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      {currentUser.profile?.name || "User"}
                    </div>
                    <div className="text-sm font-medium text-gray-500 truncate max-w-[200px]">
                      {currentUser.email}
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  {currentUser.role === "user" && (
                    <MobileNavLink path="/user-profile" label="Your Profile" onClick={() => setIsMenuOpen(false)} />
                  )}

                  {currentUser.role === "developer" && (
                    <MobileNavLink path="/dev-profile" label="Developer Profile" onClick={() => setIsMenuOpen(false)} />
                  )}

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors duration-200"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// Desktop Navigation Link
const NavLink = ({ path, label, isActive }) => {
  return (
    <Link
      to={path}
      className={`relative inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-all duration-200
        ${
          isActive
            ? "border-primary-500 text-primary-700 font-semibold"
            : "border-transparent text-gray-500 hover:border-primary-300 hover:text-primary-600"
        }
      `}
    >
      {label}
      {isActive && (
        <motion.div
          layoutId="desktop-nav-indicator"
          className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-500 to-primary-400 rounded-full"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </Link>
  );
};

// Mobile Navigation Link
const MobileNavLink = ({ path, label, isActive, onClick }) => {
  return (
    <Link
      to={path}
      className={`block pl-3 pr-4 py-3 text-base font-medium rounded-md transition-all duration-200
        ${
          isActive
            ? "text-primary-700 bg-primary-50 border-l-4 border-primary-500 shadow-sm"
            : "text-gray-600 hover:bg-gray-50 hover:border-primary-300 hover:text-primary-700 border-l-4 border-transparent"
        }
      `}
      onClick={onClick}
    >
      {label}
    </Link>
  );
};

// Profile Dropdown Link
const ProfileLink = ({ to, label, onClick }) => {
  return (
    <Link
      to={to}
      className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors duration-200"
      role="menuitem"
      onClick={onClick}
    >
      {label}
    </Link>
  );
};

export default Navbar;
