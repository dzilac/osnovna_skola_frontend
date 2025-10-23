import { NavLink, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isDete = user?.role === "Dete";
  const isRoditelj = user?.role === "Roditelj";

  // Navbar stil sa footer bojom
  const navbarStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    width: "100%",
    zIndex: 1000,
    padding: "1rem 1.5rem",
    transition: "all 0.3s ease, box-shadow 0.3s ease",
    borderBottom: "1px solid rgba(255,255,255,0.1)"
  };

  // Za Dete - narandžasti gradijent
  if (isDete) {
    navbarStyle.background = "linear-gradient(135deg, #ff9a56 0%, #ff7eb3 50%, #ff65a3 100%)";
    navbarStyle.backgroundSize = "200% 200%";
    navbarStyle.boxShadow = scrolled 
      ? "0 6px 30px rgba(255, 154, 86, 0.4)" 
      : "0 4px 20px rgba(255, 154, 86, 0.3)";
  } else {
    // Za ostale - tamni gradijent kao footer
    navbarStyle.background = "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)";
    navbarStyle.boxShadow = scrolled 
      ? "0 6px 30px rgba(0,0,0,0.3)" 
      : "0 4px 20px rgba(0,0,0,0.2)";
  }

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .navbar-dete-gradient {
          animation: gradientShift 6s ease infinite !important;
        }

        .shimmer-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%);
          background-size: 200% 200%;
          animation: shimmer 3s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }

        .nav-link:hover {
          transform: translateY(-2px) !important;
        }

        .dropdown-wrapper {
          position: relative;
        }

        .custom-dropdown-menu {
          position: absolute !important;
          top: 100% !important;
          right: 0 !important;
          margin-top: 0.5rem !important;
          z-index: 9999 !important;
        }

        /* Hamburger menu styles */
        .hamburger {
          display: none;
          flex-direction: column;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0.5rem;
          z-index: 2;
        }

        .hamburger span {
          width: 25px;
          height: 3px;
          background: white;
          margin: 3px 0;
          transition: 0.3s;
          border-radius: 3px;
        }

        .hamburger.active span:nth-child(1) {
          transform: rotate(-45deg) translate(-5px, 6px);
        }

        .hamburger.active span:nth-child(2) {
          opacity: 0;
        }

        .hamburger.active span:nth-child(3) {
          transform: rotate(45deg) translate(-5px, -6px);
        }

        /* Mobile menu */
        .mobile-menu {
          display: none;
          position: fixed;
          top: 70px;
          left: 0;
          right: 0;
          background: inherit;
          padding: 1rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
          max-height: calc(100vh - 70px);
          overflow-y: auto;
          z-index: 999;
        }

        .mobile-menu.open {
          display: block;
          animation: slideDown 0.3s ease;
        }

        .mobile-menu .nav-link {
          display: block;
          padding: 1rem;
          color: white;
          text-decoration: none;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          transition: all 0.3s ease;
        }

        .mobile-menu .nav-link:hover {
          background: rgba(255,255,255,0.1);
          padding-left: 1.5rem;
        }

        .mobile-menu .btn {
          width: 100%;
          margin: 0.5rem 0;
        }

        @media (max-width: 991px) {
          .hamburger {
            display: flex;
          }

          .navbar-collapse {
            display: none !important;
          }
        }

        @media (max-width: 768px) {
          .navbar-brand {
            font-size: 18px !important;
          }
        }

        @media (max-width: 480px) {
          .navbar-brand {
            font-size: 16px !important;
          }
        }
      `}</style>

      <nav
        className={isDete ? "navbar navbar-expand-lg navbar-dete-gradient" : "navbar navbar-expand-lg"}
        style={navbarStyle}
      >
        {/* Shimmer overlay za Dete */}
        {isDete && <div className="shimmer-overlay" />}

        <div className="container-fluid" style={{ maxWidth: "1200px", position: "relative", zIndex: 1 }}>
          {/* Brand - prikazuje se samo za Roditelj */}
          {isRoditelj && (
            <NavLink 
              className="navbar-brand fw-bold" 
              to="/"
              style={{ 
                color: "white",
                fontSize: "22px",
                letterSpacing: "-0.5px",
                transition: "all 0.3s ease",
                textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.color = "#ff9a56";
                e.currentTarget.style.textShadow = "0 4px 12px rgba(255,154,86,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.color = "white";
                e.currentTarget.style.textShadow = "0 2px 8px rgba(0,0,0,0.3)";
              }}
            >
              🏫 Osnovna škola
            </NavLink>
          )}

          {/* Brand za Dete */}
          {isDete && (
            <NavLink 
              className="navbar-brand fw-bold" 
              to="/dete-dashboard"
              style={{ 
                color: "white",
                fontSize: "22px",
                letterSpacing: "-0.5px",
                textShadow: "0 2px 8px rgba(0,0,0,0.2)",
                transition: "all 0.3s ease",
                position: "relative",
                zIndex: 2
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05) rotate(-2deg)";
                e.currentTarget.style.textShadow = "0 4px 12px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1) rotate(0deg)";
                e.currentTarget.style.textShadow = "0 2px 8px rgba(0,0,0,0.2)";
              }}
            >
              ✨ Moja škola
            </NavLink>
          )}

          {/* Guest brand */}
          {!user && (
            <NavLink 
              className="navbar-brand fw-bold" 
              to="/"
              style={{ 
                color: "white",
                fontSize: "22px",
                letterSpacing: "-0.5px",
                transition: "all 0.3s ease",
                textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.color = "#ff9a56";
                e.currentTarget.style.textShadow = "0 4px 12px rgba(255,154,86,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.color = "white";
                e.currentTarget.style.textShadow = "0 2px 8px rgba(0,0,0,0.3)";
              }}
            >
              🏫 Osnovna škola
            </NavLink>
          )}

          {/* Hamburger button */}
          <button 
            className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Desktop Navigation */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul 
              className="navbar-nav ms-auto align-items-center" 
              style={{ 
                gap: "20px",
                position: "relative",
                zIndex: 2
              }}
            >
              {/* Linkovi za Dete */}
              {isDete && (
                <>
                  <li className="nav-item">
                    <NavLink 
                      to="/dete-dashboard" 
                      className="nav-link fw-semibold"
                      style={({ isActive }) => ({
                        color: "white",
                        fontSize: "15px",
                        padding: "8px 16px",
                        borderRadius: "20px",
                        transition: "all 0.3s ease",
                        background: isActive ? "rgba(255,255,255,0.25)" : "transparent",
                        backdropFilter: isActive ? "blur(10px)" : "none",
                        textShadow: "0 2px 6px rgba(0,0,0,0.2)"
                      })}
                      onMouseEnter={(e) => {
                        if (!e.currentTarget.classList.contains('active')) {
                          e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                          e.currentTarget.style.transform = "translateY(-2px)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!e.currentTarget.classList.contains('active')) {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.transform = "translateY(0)";
                        }
                      }}
                    >
                      🏠 Početna
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink 
                      to="/raspored-casova" 
                      className="nav-link fw-semibold"
                      style={({ isActive }) => ({
                        color: "white",
                        fontSize: "15px",
                        padding: "8px 16px",
                        borderRadius: "20px",
                        transition: "all 0.3s ease",
                        background: isActive ? "rgba(255,255,255,0.25)" : "transparent",
                        backdropFilter: isActive ? "blur(10px)" : "none",
                        textShadow: "0 2px 6px rgba(0,0,0,0.2)"
                      })}
                      onMouseEnter={(e) => {
                        if (!e.currentTarget.classList.contains('active')) {
                          e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                          e.currentTarget.style.transform = "translateY(-2px)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!e.currentTarget.classList.contains('active')) {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.transform = "translateY(0)";
                        }
                      }}
                    >
                      📅 Raspored
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink 
                      to="/ocene" 
                      className="nav-link fw-semibold"
                      style={({ isActive }) => ({
                        color: "white",
                        fontSize: "15px",
                        padding: "8px 16px",
                        borderRadius: "20px",
                        transition: "all 0.3s ease",
                        background: isActive ? "rgba(255,255,255,0.25)" : "transparent",
                        backdropFilter: isActive ? "blur(10px)" : "none",
                        textShadow: "0 2px 6px rgba(0,0,0,0.2)"
                      })}
                      onMouseEnter={(e) => {
                        if (!e.currentTarget.classList.contains('active')) {
                          e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                          e.currentTarget.style.transform = "translateY(-2px)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!e.currentTarget.classList.contains('active')) {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.transform = "translateY(0)";
                        }
                      }}
                    >
                      ⭐ Ocene
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink 
                      to="/izostanci" 
                      className="nav-link fw-semibold"
                      style={({ isActive }) => ({
                        color: "white",
                        fontSize: "15px",
                        padding: "8px 16px",
                        borderRadius: "20px",
                        transition: "all 0.3s ease",
                        background: isActive ? "rgba(255,255,255,0.25)" : "transparent",
                        backdropFilter: isActive ? "blur(10px)" : "none",
                        textShadow: "0 2px 6px rgba(0,0,0,0.2)"
                      })}
                      onMouseEnter={(e) => {
                        if (!e.currentTarget.classList.contains('active')) {
                          e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                          e.currentTarget.style.transform = "translateY(-2px)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!e.currentTarget.classList.contains('active')) {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.transform = "translateY(0)";
                        }
                      }}
                    >
                      📋 Izostanci
                    </NavLink>
                  </li>
                </>
              )}

              {/* Linkovi za roditelja */}
              {isRoditelj && (
                <>
                  <li className="nav-item">
                    <NavLink 
                      to="/roditelj-dashboard" 
                      className="nav-link fw-semibold"
                      style={({ isActive }) => ({
                        color: "white",
                        fontSize: "15px",
                        padding: "8px 16px",
                        borderRadius: "20px",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        background: isActive ? "rgba(255,255,255,0.2)" : "transparent",
                        backdropFilter: isActive ? "blur(10px)" : "none",
                        textShadow: "0 2px 6px rgba(0,0,0,0.2)"
                      })}
                      onMouseEnter={(e) => {
                        if (!e.currentTarget.classList.contains('active')) {
                          e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                          e.currentTarget.style.transform = "translateY(-2px)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!e.currentTarget.classList.contains('active')) {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.transform = "translateY(0)";
                        }
                      }}
                    >
                      👨‍👩‍👧 Pregled dece
                    </NavLink>
                  </li>
                </>
              )}

              {/* User dropdown ili login/register */}
              <li className="nav-item dropdown-wrapper" ref={dropdownRef}>
                {user ? (
                  <>
                    <button
                      className="btn d-flex align-items-center gap-2"
                      onClick={() => setShowDropdown(!showDropdown)}
                      style={{
                        background: isDete 
                          ? "rgba(255,255,255,0.25)" 
                          : "rgba(255,255,255,0.15)",
                        color: "white",
                        border: isDete 
                          ? "2px solid rgba(255,255,255,0.4)" 
                          : "2px solid rgba(255,255,255,0.3)",
                        borderRadius: "25px",
                        padding: "8px 20px",
                        fontWeight: "600",
                        fontSize: "14px",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        backdropFilter: "blur(10px)",
                        boxShadow: isDete 
                          ? "0 4px 15px rgba(255,255,255,0.2)" 
                          : "0 4px 15px rgba(0,0,0,0.1)"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = isDete 
                          ? "rgba(255,255,255,0.35)" 
                          : "rgba(255,255,255,0.25)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = isDete 
                          ? "0 6px 20px rgba(255,255,255,0.3)" 
                          : "0 6px 20px rgba(255, 154, 86, 0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = isDete 
                          ? "rgba(255,255,255,0.25)" 
                          : "rgba(255,255,255,0.15)";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = isDete 
                          ? "0 4px 15px rgba(255,255,255,0.2)" 
                          : "0 4px 15px rgba(0,0,0,0.1)";
                      }}
                    >
                      <span style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: isDete 
                          ? "linear-gradient(135deg, rgba(255,255,255,0.4), rgba(255,255,255,0.2))" 
                          : "linear-gradient(135deg, #ff9a56, #ff7eb3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "16px",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.2)"
                      }}>
                        {isDete ? "👦" : "👤"}
                      </span>
                      <span>{user.ime}</span>
                      <span style={{
                        fontSize: "10px",
                        transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.3s ease"
                      }}>
                        ▼
                      </span>
                    </button>
                    
                    {showDropdown && (
                      <div 
                        className="custom-dropdown-menu"
                        style={{
                          background: "white",
                          borderRadius: "16px",
                          minWidth: "220px",
                          boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
                          border: "1px solid rgba(0,0,0,0.05)",
                          overflow: "hidden",
                          animation: "slideDown 0.2s ease-out"
                        }}
                      >
                        {/* Dashboard link za roditelja */}
                        {isRoditelj && (
                          <NavLink 
                            to="/roditelj-dashboard" 
                            className="dropdown-item"
                            style={{ 
                              fontSize: "14px",
                              padding: "12px 16px",
                              color: "#5a6c7d",
                              fontWeight: "500",
                              transition: "all 0.2s ease",
                              borderLeft: "3px solid transparent",
                              display: "block"
                            }}
                            onClick={() => setShowDropdown(false)}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "linear-gradient(to right, #fff5f0, transparent)";
                              e.currentTarget.style.paddingLeft = "20px";
                              e.currentTarget.style.borderLeftColor = "#ff9a56";
                              e.currentTarget.style.color = "#ff9a56";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "transparent";
                              e.currentTarget.style.paddingLeft = "16px";
                              e.currentTarget.style.borderLeftColor = "transparent";
                              e.currentTarget.style.color = "#5a6c7d";
                            }}
                          >
                            👨‍👩‍👧 Pregled dece
                          </NavLink>
                        )}
                        
                        {/* Opcije samo za nedete korisnike */}
                        {!isDete && (
                          <>
                            <NavLink 
                              to="/profil" 
                              className="dropdown-item"
                              style={{ 
                                fontSize: "14px",
                                padding: "12px 16px",
                                color: "#5a6c7d",
                                transition: "all 0.2s ease",
                                borderLeft: "3px solid transparent",
                                display: "block"
                              }}
                              onClick={() => setShowDropdown(false)}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = "linear-gradient(to right, #fff5f0, transparent)";
                                e.currentTarget.style.paddingLeft = "20px";
                                e.currentTarget.style.borderLeftColor = "#ff9a56";
                                e.currentTarget.style.color = "#ff9a56";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = "transparent";
                                e.currentTarget.style.paddingLeft = "16px";
                                e.currentTarget.style.borderLeftColor = "transparent";
                                e.currentTarget.style.color = "#5a6c7d";
                              }}
                            >
                              👤 Profil
                            </NavLink>
                            
                            <NavLink 
                              to="/promeni-lozinku" 
                              className="dropdown-item"
                              style={{ 
                                fontSize: "14px",
                                padding: "12px 16px",
                                color: "#5a6c7d",
                                transition: "all 0.2s ease",
                                borderLeft: "3px solid transparent",
                                display: "block"
                              }}
                              onClick={() => setShowDropdown(false)}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = "linear-gradient(to right, #fff5f0, transparent)";
                                e.currentTarget.style.paddingLeft = "20px";
                                e.currentTarget.style.borderLeftColor = "#ff9a56";
                                e.currentTarget.style.color = "#ff9a56";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = "transparent";
                                e.currentTarget.style.paddingLeft = "16px";
                                e.currentTarget.style.borderLeftColor = "transparent";
                                e.currentTarget.style.color = "#5a6c7d";
                              }}
                            >
                              🔒 Promeni lozinku
                            </NavLink>
                            
                            <div className="dropdown-divider" style={{ margin: "8px 0" }}></div>
                          </>
                        )}
                        
                        <button
                          className="dropdown-item"
                          onClick={handleLogout}
                          style={{ 
                            fontSize: "14px",
                            padding: "12px 16px",
                            color: "#e74c3c",
                            fontWeight: "500",
                            transition: "all 0.2s ease",
                            border: "none",
                            background: "none",
                            width: "100%",
                            textAlign: "left",
                            borderLeft: "3px solid transparent",
                            display: "block"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "linear-gradient(to right, #fee, transparent)";
                            e.currentTarget.style.paddingLeft = "20px";
                            e.currentTarget.style.borderLeftColor = "#e74c3c";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.paddingLeft = "16px";
                            e.currentTarget.style.borderLeftColor = "transparent";
                          }}
                        >
                          🚪 Odjavi se
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <NavLink 
                      to="/login" 
                      className="btn"
                      style={{
                        backgroundColor: "transparent",
                        color: "white",
                        border: "2px solid rgba(255,255,255,0.4)",
                        borderRadius: "25px",
                        padding: "8px 24px",
                        fontWeight: "600",
                        fontSize: "14px",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        backdropFilter: "blur(10px)"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.2)";
                        e.currentTarget.style.color = "#ff9a56";
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 6px 20px rgba(255, 154, 86, 0.4)";
                        e.currentTarget.style.borderColor = "#ff9a56";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "white";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
                      }}
                    >
                      Prijava
                    </NavLink>
                    <NavLink 
                      to="/register" 
                      className="btn"
                      style={{
                        background: "linear-gradient(135deg, #ff9a56, #ff7eb3)",
                        color: "white",
                        border: "none",
                        borderRadius: "25px",
                        padding: "8px 24px",
                        fontWeight: "600",
                        fontSize: "14px",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "linear-gradient(135deg, #ff8542, #ff6ba0)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 6px 20px rgba(255, 133, 66, 0.5)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "linear-gradient(135deg, #ff9a56, #ff7eb3)";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      Registracija
                    </NavLink>
                  </div>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        {isDete && (
          <>
            <NavLink 
              to="/dete-dashboard" 
              className="nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              🏠 Početna
            </NavLink>
            <NavLink 
              to="/raspored-casova" 
              className="nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              📅 Raspored
            </NavLink>
            <NavLink 
              to="/ocene" 
              className="nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              ⭐ Ocene
            </NavLink>
            <NavLink 
              to="/izostanci" 
              className="nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              📋 Izostanci
            </NavLink>
          </>
        )}

        {isRoditelj && (
          <NavLink 
            to="/roditelj-dashboard" 
            className="nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            👨‍👩‍👧 Pregled dece
          </NavLink>
        )}

        {user ? (
          <div style={{ padding: "1rem 0", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            {!isDete && (
              <>
                <NavLink 
                  to="/profil" 
                  className="nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  👤 Profil
                </NavLink>
                <NavLink 
                  to="/promeni-lozinku" 
                  className="nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🔒 Promeni lozinku
                </NavLink>
              </>
            )}
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="nav-link"
              style={{
                width: "100%",
                textAlign: "left",
                background: "none",
                border: "none",
                color: "#e74c3c"
              }}
            >
              🚪 Odjavi se
            </button>
          </div>
        ) : (
          <div style={{ padding: "1rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <NavLink 
              to="/login" 
              className="btn"
              style={{
                backgroundColor: "transparent",
                color: "white",
                border: "2px solid rgba(255,255,255,0.4)",
                borderRadius: "25px",
                padding: "10px 24px",
                fontWeight: "600",
                fontSize: "14px",
                width: "100%",
                marginBottom: "0.5rem"
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Prijava
            </NavLink>
            <NavLink 
              to="/register" 
              className="btn"
              style={{
                background: "linear-gradient(135deg, #ff9a56, #ff7eb3)",
                color: "white",
                border: "none",
                borderRadius: "25px",
                padding: "10px 24px",
                fontWeight: "600",
                fontSize: "14px",
                width: "100%"
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Registracija
            </NavLink>
          </div>
        )}
      </div>
    </>
  );
}