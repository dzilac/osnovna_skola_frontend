import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function QuizzesPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [kvizovi, setKvizovi] = useState([]);
  const [filterGrade, setFilterGrade] = useState("all");
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (loading || !user) return;

    const grade = user.grade || 0;
    fetch(`${process.env.REACT_APP_API_URL}/api/kvizovi/${grade}`)
      .then((res) => res.json())
      .then((data) => {
        setKvizovi(data);
        setPageLoading(false);
      })
      .catch((err) => {
        console.error("Greška pri učitavanju:", err);
        setPageLoading(false);
      });
  }, [user, loading]);

  if (loading || pageLoading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
        <div className="text-center">
          <div style={{ fontSize: "50px", animation: "bounce 1s infinite", marginBottom: "20px" }}>📚</div>
          <p className="text-white fs-5">Učitavanje kvizova...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" }}>
        <div className="text-center text-white">
          <div style={{ fontSize: "80px", marginBottom: "20px" }}>🔐</div>
          <h2>Nisi logovan!</h2>
          <p>Molim te, loguješ se da bi mogao da rešavaš kvizove.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 p-2" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
      <div className="container" style={{ maxWidth: "900px", paddingTop: "15px", paddingBottom: "30px" }}>
        
        {/* Header */}
        <div className="mb-3 text-center text-white">
          <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "5px" }}>
            👋 Pozdrav, {user.firstName}!
          </h1>
          <p style={{ fontSize: "14px", opacity: 0.9 }}>Odaberi kviz i počni da učiš</p>
        </div>

        {/* Stats */}
        <div className="row g-2 mb-3">
          <div className="col-6 col-sm-4">
            <div className="card border-0 shadow-sm text-center" style={{ borderRadius: "15px", background: "#ffffff" }}>
              <div className="card-body p-2">
                <div style={{ fontSize: "24px", color: "#667eea" }}>📚</div>
                <p style={{ fontSize: "12px", color: "#666", margin: 0, fontWeight: "bold" }}>Razred</p>
                <p style={{ fontSize: "16px", color: "#333", margin: 0, fontWeight: "bold" }}>{user.grade}</p>
              </div>
            </div>
          </div>
          <div className="col-6 col-sm-4">
            <div className="card border-0 shadow-sm text-center" style={{ borderRadius: "15px", background: "#ffffff" }}>
              <div className="card-body p-2">
                <div style={{ fontSize: "24px", color: "#e74c3c" }}>⭐</div>
                <p style={{ fontSize: "12px", color: "#666", margin: 0, fontWeight: "bold" }}>Kvizovi</p>
                <p style={{ fontSize: "16px", color: "#333", margin: 0, fontWeight: "bold" }}>{kvizovi.length}</p>
              </div>
            </div>
          </div>
          <div className="col-6 col-sm-4">
            <div className="card border-0 shadow-sm text-center" style={{ borderRadius: "15px", background: "#ffffff" }}>
              <div className="card-body p-2">
                <div style={{ fontSize: "24px", color: "#2ecc71" }}>🏆</div>
                <p style={{ fontSize: "12px", color: "#666", margin: 0, fontWeight: "bold" }}>Status</p>
                <p style={{ fontSize: "16px", color: "#333", margin: 0, fontWeight: "bold" }}>Spreman!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quizzes Grid */}
        {kvizovi.length > 0 ? (
          <div className="row g-2">
            {kvizovi.map((kviz) => (
              <div key={kviz._id} className="col-12 col-sm-6">
                <div
                  onClick={() => navigate(`/kviz/${kviz._id}`)}
                  className="card border-0 shadow-sm"
                  style={{
                    borderRadius: "15px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    background: "white",
                    overflow: "hidden"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                  }}
                >
                  <div
                    style={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      padding: "15px",
                      color: "white",
                      textAlign: "center"
                    }}
                  >
                    <div style={{ fontSize: "32px", marginBottom: "8px" }}>{kviz.icon}</div>
                    <h5 style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>{kviz.title}</h5>
                  </div>
                  <div className="card-body p-2">
                    <p style={{ fontSize: "12px", color: "#666", margin: 0, marginBottom: "8px" }}>
                      {kviz.description}
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span style={{ fontSize: "12px", color: "#999", fontWeight: "bold" }}>
                        {kviz.subject}
                      </span>
                      <span style={{
                        fontSize: "12px",
                        color: "white",
                        background: "#667eea",
                        padding: "4px 10px",
                        borderRadius: "10px",
                        fontWeight: "bold"
                      }}>
                        {kviz.questions?.length || 0} pitanja
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card border-0 shadow-sm" style={{ borderRadius: "15px", background: "white" }}>
            <div className="card-body p-4 text-center">
              <div style={{ fontSize: "50px", marginBottom: "15px" }}>📭</div>
              <p style={{ fontSize: "16px", color: "#666", margin: 0 }}>
                Za tvoj razred još nema dostupnih kvizova.
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}