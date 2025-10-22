import React from "react";
import { useAuth } from "../context/AuthContext";

export default function LostItemCard({ item, onDelete }) {
  const { user } = useAuth();
  const isLost = item.kind === "LOST";
  const isOwner = user?.email === item.postedBy;
  
  // Format datuma
  const formatDate = (date) => {
    if (!date) return "Nije navedeno";
    return new Date(date).toLocaleDateString('sr-RS', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Status badge
  const getStatusBadge = () => {
    switch(item.status) {
      case 'open':
        return { text: 'Aktivno', color: '#3498db', bg: '#ebf5fb' };
      case 'claimed':
        return { text: 'Prijavljeno', color: '#f39c12', bg: '#fef5e7' };
      case 'returned':
        return { text: 'Vraćeno', color: '#2ecc71', bg: '#eafaf1' };
      default:
        return { text: 'Nepoznato', color: '#95a5a6', bg: '#ecf0f1' };
    }
  };

  const statusBadge = getStatusBadge();

  const handleDelete = async () => {
    if (!window.confirm("Da li ste sigurni da želite da obrišete ovaj oglas?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/items/${item._id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Greška pri brisanju oglasa");
      }

      if (onDelete) onDelete(item._id);
      alert("Oglas je uspešno obrisan!");
    } catch (error) {
      console.error("Greška:", error);
      alert("Greška pri brisanju oglasa");
    }
  };

  return (
    <div 
      style={{
        background: "white",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        transition: "all 0.3s ease",
        height: "100%",
        display: "flex",
        flexDirection: "column"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
      }}
    >
      {/* Header sa tipom */}
      <div style={{
        background: isLost 
          ? "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)"
          : "linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)",
        padding: "12px 16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <span style={{ color: "white", fontWeight: "600", fontSize: "14px" }}>
          {isLost ? "😢 Izgubljeno" : "😊 Nađeno"}
        </span>
        <span style={{
          background: statusBadge.bg,
          color: statusBadge.color,
          padding: "4px 12px",
          borderRadius: "12px",
          fontSize: "12px",
          fontWeight: "600"
        }}>
          {statusBadge.text}
        </span>
      </div>

      {/* Image */}
      {item.images && item.images.length > 0 ? (
        <div style={{
          width: "100%",
          height: "180px",
          overflow: "hidden",
          background: "#f8f9fa"
        }}>
          <img 
            src={item.images[0]} 
            alt={item.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />
        </div>
      ) : (
        <div style={{
          width: "100%",
          height: "180px",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <span style={{ fontSize: "60px" }}>
            {isLost ? "🔍" : "✨"}
          </span>
        </div>
      )}

      {/* Content */}
      <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
        <h5 style={{
          color: "#2c3e50",
          fontWeight: "bold",
          fontSize: "18px",
          marginBottom: "8px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }}>
          {item.title}
        </h5>

        <p style={{
          color: "#7f8c8d",
          fontSize: "14px",
          marginBottom: "12px",
          lineHeight: "1.5",
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical"
        }}>
          {item.description || "Nema opisa"}
        </p>

        <div style={{ marginTop: "auto" }}>
          {/* Lokacija */}
          {item.location && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
              fontSize: "13px",
              color: "#95a5a6"
            }}>
              <span>📍</span>
              <span>{item.location}</span>
            </div>
          )}

          {/* Datum */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "8px",
            fontSize: "13px",
            color: "#95a5a6"
          }}>
            <span>📅</span>
            <span>{formatDate(item.when)}</span>
          </div>

          {/* Email kontakt */}
          {item.postedBy && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              color: "#95a5a6"
            }}>
              <span>📧</span>
              <span>{item.postedBy}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer - Dugmad */}
      <div style={{ padding: "0 16px 16px" }}>
        {isOwner ? (
          // Ako je vlasnik - prikaži dugme za brisanje
          <button
            onClick={handleDelete}
            style={{
              width: "100%",
              background: "#e74c3c",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "12px",
              fontWeight: "600",
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.9";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            🗑️ Obriši oglas
          </button>
        ) : (
          // Ako nije vlasnik - prikaži dugme za email
          <a
            href={`mailto:${item.postedBy}?subject=${encodeURIComponent(isLost ? 'Pronašao sam vašu stvar' : 'Interesuje me pronađena stvar')}&body=${encodeURIComponent('Poštovani,\n\nKontaktiram vas u vezi oglasa: ' + item.title)}`}
            style={{
              display: "block",
              width: "100%",
              background: isLost ? "#e74c3c" : "#2ecc71",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "12px",
              fontWeight: "600",
              fontSize: "14px",
              textAlign: "center",
              textDecoration: "none",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.9";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            📧 Pošalji email
          </a>
        )}
      </div>
    </div>
  );
}