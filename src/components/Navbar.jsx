import { NavLink, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
              🎓 Moj Dashboard
            </NavLink>
          )}

          {/* Toggler samo za Roditelj */}
          {isRoditelj && (
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
              style={{ 
                border: "1px solid rgba(255,255,255,0.3)",
                background: "rgba(255,255,255,0.1)"
              }}
            >
              <span className="navbar-toggler-icon" style={{ filter: "invert(1)" }}></span>
            </button>
          )}

          <div
            className={`${isRoditelj ? "collapse navbar-collapse" : ""} justify-content-between`}
            id="navbarNav"
            style={{ marginLeft: !isRoditelj ? "auto" : "0" }}
          >
            {/* Navigacioni linkovi - samo za Roditelj */}
            {isRoditelj && (
              <ul className="navbar-nav gap-1 mx-auto">
                <li className="nav-item">
                  <NavLink 
                    to="/izgubljeno-nadjeno" 
                    className="nav-link"
                    style={({ isActive }) => ({
                      color: isActive ? "#ff9a56" : "rgba(255,255,255,0.85)",
                      fontWeight: isActive ? "600" : "500",
                      fontSize: "15px",
                      padding: "8px 16px",
                      borderRadius: "12px",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      background: isActive 
                        ? "rgba(255,154,86,0.2)"
                        : "transparent",
                      transform: isActive ? "translateY(-2px)" : "translateY(0)",
                      boxShadow: isActive ? "0 4px 12px rgba(255, 154, 86, 0.3)" : "none",
                      backdropFilter: isActive ? "blur(10px)" : "none"
                    })}
                    onMouseEnter={(e) => {
                      if (!e.currentTarget.classList.contains('active')) {
                        e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                        e.currentTarget.style.color = "#ff9a56";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!e.currentTarget.classList.contains('active')) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "rgba(255,255,255,0.85)";
                      }
                    }}
                  >
                    🔍 Izgubljeno-nađeno
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/vannastavne-aktivnosti"
                    className="nav-link"
                    style={({ isActive }) => ({
                      color: isActive ? "#ff9a56" : "rgba(255,255,255,0.85)",
                      fontWeight: isActive ? "600" : "500",
                      fontSize: "15px",
                      padding: "8px 16px",
                      borderRadius: "12px",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      background: isActive 
                        ? "rgba(255,154,86,0.2)"
                        : "transparent",
                      transform: isActive ? "translateY(-2px)" : "translateY(0)",
                      boxShadow: isActive ? "0 4px 12px rgba(255, 154, 86, 0.3)" : "none",
                      backdropFilter: isActive ? "blur(10px)" : "none"
                    })}
                    onMouseEnter={(e) => {
                      if (!e.currentTarget.classList.contains('active')) {
                        e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                        e.currentTarget.style.color = "#ff9a56";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!e.currentTarget.classList.contains('active')) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "rgba(255,255,255,0.85)";
                      }
                    }}
                  >
                    ⚽ Vannastavne aktivnosti
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink 
                    to="/privatni-casovi" 
                    className="nav-link"
                    style={({ isActive }) => ({
                      color: isActive ? "#ff9a56" : "rgba(255,255,255,0.85)",
                      fontWeight: isActive ? "600" : "500",
                      fontSize: "15px",
                      padding: "8px 16px",
                      borderRadius: "12px",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      background: isActive 
                        ? "rgba(255,154,86,0.2)"
                        : "transparent",
                      transform: isActive ? "translateY(-2px)" : "translateY(0)",
                      boxShadow: isActive ? "0 4px 12px rgba(255, 154, 86, 0.3)" : "none",
                      backdropFilter: isActive ? "blur(10px)" : "none"
                    })}
                    onMouseEnter={(e) => {
                      if (!e.currentTarget.classList.contains('active')) {
                        e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                        e.currentTarget.style.color = "#ff9a56";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!e.currentTarget.classList.contains('active')) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "rgba(255,255,255,0.85)";
                      }
                    }}
                  >
                    📚 Privatni časovi
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink 
                    to="/pronadji-dete" 
                    className="nav-link"
                    style={({ isActive }) => ({
                      color: isActive ? "#ff9a56" : "rgba(255,255,255,0.85)",
                      fontWeight: isActive ? "600" : "500",
                      fontSize: "15px",
                      padding: "8px 16px",
                      borderRadius: "12px",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      background: isActive 
                        ? "rgba(255,154,86,0.2)"
                        : "transparent",
                      transform: isActive ? "translateY(-2px)" : "translateY(0)",
                      boxShadow: isActive ? "0 4px 12px rgba(255, 154, 86, 0.3)" : "none",
                      backdropFilter: isActive ? "blur(10px)" : "none"
                    })}
                    onMouseEnter={(e) => {
                      if (!e.currentTarget.classList.contains('active')) {
                        e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                        e.currentTarget.style.color = "#ff9a56";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!e.currentTarget.classList.contains('active')) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "rgba(255,255,255,0.85)";
                      }
                    }}
                  >
                    📍 Pronađi dete
                  </NavLink>
                </li>
              </ul>
            )}

            {/* Dropdown user meni - prikazuje se za sve */}
            <div className="dropdown-wrapper" ref={dropdownRef} style={{ position: "relative" }}>
              {user ? (
                <>
                  <div 
                    style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "10px",
                      cursor: "pointer",
                      padding: "8px 14px",
                      borderRadius: "50px",
                      background: isDete 
                        ? "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 100%)"
                        : "rgba(255,255,255,0.1)",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      transform: showDropdown ? "scale(0.98)" : "scale(1)",
                      boxShadow: isDete 
                        ? "0 4px 12px rgba(0,0,0,0.15)"
                        : "0 4px 12px rgba(0,0,0,0.2)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      position: "relative",
                      zIndex: 2
                    }}
                    onClick={() => setShowDropdown(!showDropdown)}
                    onMouseEnter={(e) => {
                      if (!isDete) {
                        e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                        e.currentTarget.style.transform = "scale(1.02)";
                        e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.3)";
                      } else {
                        e.currentTarget.style.background = "linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.25) 100%)";
                        e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.2)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isDete) {
                        e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
                      } else {
                        e.currentTarget.style.background = "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 100%)";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                      }
                    }}
                  >
                    <img
                      src={
                        user.profileImage ||
                        "https://res.cloudinary.com/dbadhjapn/image/upload/v1759935595/profile-icon-design-free-vector_fqsu80.jpg"
                      }
                      alt="Profil"
                      className="rounded-circle"
                      width="36"
                      height="36"
                      style={{ 
                        border: "2px solid white",
                        objectFit: "cover",
                        transition: "transform 0.3s ease",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.15) rotate(5deg)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1) rotate(0deg)";
                      }}
                    />
                    {isRoditelj && (
                      <span style={{ 
                        color: "white", 
                        fontWeight: "500",
                        fontSize: "14px",
                        textShadow: "0 1px 3px rgba(0,0,0,0.3)"
                      }}>
                        {user.firstName}
                      </span>
                    )}
                    <span style={{ 
                      color: "white",
                      fontSize: "12px",
                      transition: "transform 0.3s ease",
                      transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)",
                      display: "inline-block"
                    }}>
                      ▼
                    </span>
                  </div>
                  {showDropdown && (
                    <div
                      className="custom-dropdown-menu"
                      style={{ 
                        minWidth: "220px", 
                        borderRadius: "16px",
                        border: "1px solid #e0e0e0",
                        background: "linear-gradient(to bottom, #ffffff 0%, #f9fafb 100%)",
                        boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
                        animation: "slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        transformOrigin: "top right",
                        overflow: "hidden"
                      }}
                    >
                      <div 
                        className="px-3 py-3" 
                        style={{ 
                          borderBottom: "1px solid #f0f0f0",
                          background: "linear-gradient(135deg, #fff5f0 0%, #ffe8dc 100%)",
                          animation: "fadeIn 0.4s ease"
                        }}
                      >
                        <div style={{ fontWeight: "600", color: "#2c3e50", fontSize: "15px" }}>
                          {user.firstName} {user.lastName}
                        </div>
                        <div style={{ fontSize: "12px", color: "#95a5a6", marginTop: "2px" }}>
                          {user.email}
                        </div>
                      </div>
                      
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
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}