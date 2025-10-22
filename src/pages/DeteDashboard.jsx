import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AOS from "aos";
import "aos/dist/aos.css";

export default function DeteDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [kvizovi, setKvizovi] = useState([]);
  const [completedQuizzes, setCompletedQuizzes] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    if (user?.grade) {
      fetch(`${process.env.REACT_APP_API_URL}/api/kvizovi/${user.grade}`)
        .then((res) => res.json())
        .then((data) => setKvizovi(data))
        .catch((err) => console.error(err));
    }
  }, [user?.grade]);

  useEffect(() => {
    if (user?.id) {
      fetch(`${process.env.REACT_APP_API_URL}/api/user/${user.id}/completed`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setCompletedQuizzes(data.map((q) => q.quizId));
          }
        })
        .catch((err) => console.error(err));
    }
  }, [user?.id]);

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
        <div className="text-center">
          <div style={{ fontSize: "80px", animation: "bounce 1s infinite", marginBottom: "30px" }}>📚</div>
          <p className="text-white fs-3 fw-bold">Učitavanje...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      background: "linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)", 
      minHeight: "100vh", 
      paddingTop: "20px", 
      paddingBottom: "20px" 
    }}>
      <div className="container" style={{ maxWidth: "1400px" }}>
        
        {/* Welcome Section */}
        <div className="text-center mb-3 text-white" data-aos="fade-down">
          <h1 style={{ 
            fontSize: "56px", 
            fontWeight: "bold", 
            marginBottom: "15px",
            textShadow: "0 4px 15px rgba(0,0,0,0.2)"
          }}>
            👋 Ćao, {user?.firstName}!
          </h1>
          <p style={{ 
            fontSize: "24px", 
            opacity: 0.95, 
            margin: 0,
            textShadow: "0 2px 8px rgba(0,0,0,0.15)"
          }}>
            Uči kroz zabavne kvizove 🎉
          </p>
        </div>

        <div data-aos="fade-up" className="mb-4" >
          <h3 style={{ 
            color: "white", 
            fontWeight: "bold", 
            marginBottom: "25px", 
            fontSize: "32px",
            textShadow: "0 2px 8px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}>
            <span>🎮</span>
            <span>Moji kvizovi</span>
          </h3>

          {kvizovi.length > 0 ? (
            <div className="row g-4">
              {kvizovi.map((kviz, index) => {
                const isCompleted = completedQuizzes.includes(kviz._id);
                
                return (
                  <div
                    key={kviz._id}
                    className="col-12 col-sm-6 col-md-4 col-lg-3"
                    data-aos={index % 3 === 0 ? "zoom-in-up" : index % 3 === 1 ? "flip-left" : "zoom-in"}
                    data-aos-delay={index * 50}
                  >
                    <div
                      onClick={() => !isCompleted && navigate(`/kviz/${kviz._id}`)}
                      style={{
                        background: isCompleted 
                          ? "linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)"
                          : "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
                        borderRadius: "20px",
                        padding: "0",
                        cursor: isCompleted ? "default" : "pointer",
                        transition: "all 0.3s ease",
                        border: isCompleted ? "3px solid #28a745" : "2px solid rgba(255,255,255,0.3)",
                        opacity: isCompleted ? 0.85 : 1,
                        height: "100%",
                        position: "relative",
                        overflow: "hidden"
                      }}
                      onMouseEnter={(e) => {
                        if (!isCompleted) {
                          e.currentTarget.style.transform = "translateY(-10px) scale(1.02)";
                          e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.2)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isCompleted) {
                          e.currentTarget.style.transform = "translateY(0) scale(1)";
                          e.currentTarget.style.boxShadow = "0 5px 15px rgba(0,0,0,0.1)";
                        }
                      }}
                      className="card border-0 shadow-lg"
                    >
                      {isCompleted && (
                        <div style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          background: "#28a745",
                          color: "white",
                          padding: "6px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "bold",
                          boxShadow: "0 4px 12px rgba(40,167,69,0.4)",
                          zIndex: 1
                        }}>
                          ✓ Završen
                        </div>
                      )}
                      
                      <div className="card-body p-4 text-center">
                        <div style={{ 
                          fontSize: "64px", 
                          marginBottom: "15px",
                          animation: !isCompleted ? "float 3s ease-in-out infinite" : "none"
                        }}>
                          {kviz.icon}
                        </div>
                        
                        <h5 style={{ 
                          color: isCompleted ? "#155724" : "#2e8b57", 
                          fontWeight: "bold", 
                          marginBottom: "10px", 
                          fontSize: "20px" 
                        }}>
                          {kviz.title}
                        </h5>
                        
                        <p style={{ 
                          color: "#333", 
                          fontSize: "14px", 
                          marginBottom: "15px", 
                          lineHeight: "1.6",
                          minHeight: "40px"
                        }}>
                          {kviz.description}
                        </p>

                        <div className="d-flex justify-content-between align-items-center mb-3" 
                          style={{ 
                            fontSize: "13px", 
                            color: "#666",
                            padding: "12px",
                            background: "rgba(255,255,255,0.5)",
                            borderRadius: "12px"
                          }}>
                          <span style={{ fontWeight: "600" }}>
                            📖 {kviz.subject}
                          </span>
                          <span style={{ 
                            background: "#ff6a88", 
                            color: "white", 
                            padding: "5px 12px", 
                            borderRadius: "12px", 
                            fontWeight: "bold" 
                          }}>
                            {kviz.questions?.length || 0} pitanja
                          </span>
                        </div>

                        {!isCompleted && (
                          <button
                            onClick={() => navigate(`/kviz/${kviz._id}`)}
                            style={{
                              width: "100%",
                              background: "linear-gradient(135deg, #ff5e78 0%, #e84856 100%)",
                              color: "white",
                              border: "none",
                              borderRadius: "14px",
                              padding: "14px",
                              fontWeight: "bold",
                              fontSize: "16px",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                              boxShadow: "0 4px 15px rgba(255,94,120,0.4)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "8px"
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "linear-gradient(135deg, #e84856 0%, #d63645 100%)";
                              e.currentTarget.style.transform = "translateY(-2px)";
                              e.currentTarget.style.boxShadow = "0 6px 20px rgba(255,94,120,0.5)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "linear-gradient(135deg, #ff5e78 0%, #e84856 100%)";
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow = "0 4px 15px rgba(255,94,120,0.4)";
                            }}
                          >
                            <span style={{ fontSize: "20px" }}>🚀</span>
                            <span>Pokreni kviz</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="card border-0 shadow-lg" style={{ 
              borderRadius: "25px", 
              background: "white" 
            }} data-aos="zoom-in">
              <div className="card-body p-5 text-center">
                <div style={{ 
                  fontSize: "100px", 
                  marginBottom: "25px",
                  animation: "float 3s ease-in-out infinite"
                }}>
                  📭
                </div>
                <h4 style={{ 
                  fontSize: "24px", 
                  color: "#2c3e50", 
                  marginBottom: "15px",
                  fontWeight: "700"
                }}>
                  Nema dostupnih kvizova
                </h4>
                <p style={{ 
                  fontSize: "16px", 
                  color: "#7f8c8d", 
                  margin: 0 
                }}>
                  Za tvoj razred još nema dostupnih kvizova. Proveri ponovo kasnije!
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="row g-4 mb-5">
          <div className="col-6 col-md-3" data-aos="zoom-in" data-aos-delay="0">
            <div className="card border-0 shadow-lg" style={{ 
              borderRadius: "20px", 
              background: "white",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.1)";
            }}>
              <div className="card-body text-center p-4">
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>📚</div>
                <p style={{ fontSize: "14px", color: "#666", margin: 0, fontWeight: "600", marginBottom: "8px" }}>
                  Razred
                </p>
                <p style={{ fontSize: "36px", color: "#ff9a56", margin: 0, fontWeight: "bold" }}>
                  {user?.grade}.
                </p>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3" data-aos="zoom-in" data-aos-delay="100">
            <div className="card border-0 shadow-lg" style={{ 
              borderRadius: "20px", 
              background: "white",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.1)";
            }}>
              <div className="card-body text-center p-4">
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>🎮</div>
                <p style={{ fontSize: "14px", color: "#666", margin: 0, fontWeight: "600", marginBottom: "8px" }}>
                  Dostupni kvizovi
                </p>
                <p style={{ fontSize: "36px", color: "#e74c3c", margin: 0, fontWeight: "bold" }}>
                  {kvizovi.length}
                </p>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3" data-aos="zoom-in" data-aos-delay="200">
            <div className="card border-0 shadow-lg" style={{ 
              borderRadius: "20px", 
              background: "white",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.1)";
            }}>
              <div className="card-body text-center p-4">
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>✅</div>
                <p style={{ fontSize: "14px", color: "#666", margin: 0, fontWeight: "600", marginBottom: "8px" }}>
                  Završeni
                </p>
                <p style={{ fontSize: "36px", color: "#2ecc71", margin: 0, fontWeight: "bold" }}>
                  {completedQuizzes.length}
                </p>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3" data-aos="zoom-in" data-aos-delay="300">
            <div className="card border-0 shadow-lg" style={{ 
              borderRadius: "20px", 
              background: "linear-gradient(135deg, #f39c12 0%, #e67e22 100%)",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px) rotate(-2deg)";
              e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) rotate(0deg)";
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.1)";
            }}>
              <div className="card-body text-center p-4">
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>🏆</div>
                <p style={{ fontSize: "14px", color: "white", margin: 0, fontWeight: "600", marginBottom: "8px", opacity: 0.9 }}>
                  Uspeh
                </p>
                <p style={{ fontSize: "36px", color: "white", margin: 0, fontWeight: "bold" }}>
                  {kvizovi.length > 0 ? Math.round((completedQuizzes.length / kvizovi.length) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}