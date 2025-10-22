import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import LostItemCard from "../components/LostItemCard";
import AddLostItemForm from "../components/AddLostItemForm";
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function LostAndFound() {
  const { user } = useAuth();
  const isRoditelj = user?.role === "Roditelj";

  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState("izgubljeno");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic'
    });
  }, []);

  const loadItems = () => {
    fetch("http://localhost:5000/api/items")
      .then(res => {
        if (!res.ok) throw new Error("Greška prilikom dohvaćanja");
        return res.json();
      })
      .then(data => {
        setItems(data);
      })
      .catch(error => {
        console.error("Greška:", error);
      });
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleDelete = (itemId) => {
    setItems(items.filter(item => item._id !== itemId));
  };

  // Filtriraj stavke po tipu
  const filteredItems = items.filter(item => {
    if (activeTab === "izgubljeno") return item.kind === "LOST";
    if (activeTab === "nadjeno") return item.kind === "FOUND";
    return false;
  });

  return (
    <div style={{ 
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", 
      minHeight: "100vh", 
      paddingTop: "100px", 
      paddingBottom: "50px" 
    }}>
      <div className="container" style={{ maxWidth: "1200px" }}>
        
        {/* Header */}
        <div className="text-center mb-5" data-aos="fade-down">
          <h1 style={{ 
            fontSize: "42px", 
            fontWeight: "bold", 
            color: "#2c3e50", 
            marginBottom: "15px",
            textShadow: "0 2px 10px rgba(0,0,0,0.1)"
          }}>
            🔍 Izgubljeno – Nađeno
          </h1>
          <p style={{ fontSize: "18px", color: "#7f8c8d", maxWidth: "600px", margin: "0 auto" }}>
            Pomozite jedni drugima da pronađete izgubljene stvari
          </p>
        </div>

        {/* Tabs */}
        <div className="d-flex justify-content-center mb-5" data-aos="fade-up" data-aos-delay="100">
          <div style={{ 
            background: "white", 
            borderRadius: "50px", 
            padding: "8px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            display: "inline-flex",
            border: "2px solid #e0e0e0"
          }}>
            <button
              onClick={() => setActiveTab("izgubljeno")}
              style={{
                background: activeTab === "izgubljeno" 
                  ? "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)" 
                  : "transparent",
                color: activeTab === "izgubljeno" ? "white" : "#7f8c8d",
                border: "none",
                borderRadius: "50px",
                padding: "14px 40px",
                fontWeight: "600",
                fontSize: "16px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: activeTab === "izgubljeno" ? "0 4px 15px rgba(231, 76, 60, 0.4)" : "none",
                transform: activeTab === "izgubljeno" ? "scale(1.05)" : "scale(1)"
              }}
              onMouseEnter={(e) => {
                if (activeTab !== "izgubljeno") {
                  e.currentTarget.style.color = "#e74c3c";
                  e.currentTarget.style.background = "#fef5f5";
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== "izgubljeno") {
                  e.currentTarget.style.color = "#7f8c8d";
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              😢 Izgubljeno
            </button>
            <button
              onClick={() => setActiveTab("nadjeno")}
              style={{
                background: activeTab === "nadjeno" 
                  ? "linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)" 
                  : "transparent",
                color: activeTab === "nadjeno" ? "white" : "#7f8c8d",
                border: "none",
                borderRadius: "50px",
                padding: "14px 40px",
                fontWeight: "600",
                fontSize: "16px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: activeTab === "nadjeno" ? "0 4px 15px rgba(46, 204, 113, 0.4)" : "none",
                transform: activeTab === "nadjeno" ? "scale(1.05)" : "scale(1)"
              }}
              onMouseEnter={(e) => {
                if (activeTab !== "nadjeno") {
                  e.currentTarget.style.color = "#2ecc71";
                  e.currentTarget.style.background = "#f0fdf4";
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== "nadjeno") {
                  e.currentTarget.style.color = "#7f8c8d";
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              😊 Nađeno
            </button>
          </div>
        </div>

        {/* Add Button - samo za roditelje */}
        {isRoditelj && (
          <div className="text-center mb-5" data-aos="fade-up" data-aos-delay="200">
            <button
              onClick={() => setShowModal(true)}
              style={{
                background: activeTab === "izgubljeno" 
                  ? "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)" 
                  : "linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)",
                color: "white",
                border: "none",
                borderRadius: "50px",
                padding: "16px 40px",
                fontWeight: "700",
                fontSize: "17px",
                cursor: "pointer",
                boxShadow: activeTab === "izgubljeno" 
                  ? "0 6px 20px rgba(231, 76, 60, 0.4)" 
                  : "0 6px 20px rgba(46, 204, 113, 0.4)",
                transition: "all 0.3s ease",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = activeTab === "izgubljeno"
                  ? "0 8px 25px rgba(231, 76, 60, 0.5)"
                  : "0 8px 25px rgba(46, 204, 113, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = activeTab === "izgubljeno"
                  ? "0 6px 20px rgba(231, 76, 60, 0.4)"
                  : "0 6px 20px rgba(46, 204, 113, 0.4)";
              }}
            >
              <span style={{ fontSize: "22px" }}>+</span>
              <span>Dodaj oglas</span>
            </button>
          </div>
        )}

        {/* Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="row g-4">
            {filteredItems.map((item, index) => (
              <div 
                className="col-12 col-sm-6 col-lg-4" 
                key={item._id}
                data-aos="fade-up"
                data-aos-delay={index * 50}
              >
                <LostItemCard item={item} onDelete={handleDelete} />
              </div>
            ))}
          </div>
        ) : (
          <div 
            className="card border-0 shadow-lg" 
            style={{ 
              borderRadius: "25px", 
              background: "white",
              overflow: "hidden"
            }}
            data-aos="zoom-in"
          >
            <div className="card-body p-5 text-center">
              <div style={{ 
                fontSize: "80px", 
                marginBottom: "25px",
                animation: "float 3s ease-in-out infinite"
              }}>
                {activeTab === "izgubljeno" ? "🔍" : "✨"}
              </div>
              <h4 style={{ 
                color: "#2c3e50", 
                marginBottom: "15px",
                fontSize: "24px",
                fontWeight: "700"
              }}>
                {activeTab === "izgubljeno" 
                  ? "Nema prijavljenih izgubljenih stvari" 
                  : "Nema prijavljenih pronađenih stvari"}
              </h4>
              <p style={{ 
                color: "#7f8c8d", 
                fontSize: "16px",
                maxWidth: "400px",
                margin: "0 auto"
              }}>
                {isRoditelj 
                  ? "Budite prvi koji će dodati oglas!" 
                  : "Za sada nema oglasa u ovoj kategoriji"}
              </p>
            </div>
          </div>
        )}

        {/* Modal za dodavanje oglasa */}
        {showModal && (
          <div 
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(5px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1050,
              padding: "20px",
              animation: "fadeIn 0.3s ease"
            }}
            onClick={() => setShowModal(false)}
          >
            <div 
              style={{
                background: "white",
                borderRadius: "25px",
                maxWidth: "650px",
                width: "100%",
                maxHeight: "90vh",
                overflowY: "auto",
                position: "relative",
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                animation: "slideUp 0.3s ease"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ padding: "35px" }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 style={{ 
                    color: "#2c3e50", 
                    margin: 0,
                    fontSize: "26px",
                    fontWeight: "700"
                  }}>
                    {activeTab === "izgubljeno" ? "📢 Prijavi izgubljenu stvar" : "✨ Prijavi pronađenu stvar"}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    style={{
                      background: "#f8f9fa",
                      border: "none",
                      fontSize: "28px",
                      cursor: "pointer",
                      color: "#95a5a6",
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#e74c3c";
                      e.currentTarget.style.color = "white";
                      e.currentTarget.style.transform = "rotate(90deg)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#f8f9fa";
                      e.currentTarget.style.color = "#95a5a6";
                      e.currentTarget.style.transform = "rotate(0deg)";
                    }}
                  >
                    ×
                  </button>
                </div>
                
                <AddLostItemForm 
                  type={activeTab}
                  onSuccess={() => {
                    setShowModal(false);
                    loadItems();
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}