import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AddLostItemForm({ type, onSuccess }) {
  const { user } = useAuth();
  const isLost = type === "izgubljeno";

  const [formData, setFormData] = useState({
    kind: isLost ? "LOST" : "FOUND",
    title: "",
    description: "",
    location: "",
    when: "",
    postedBy: user?.email || ""
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "image") {
      const file = files[0];
      if (file) {
        setImageFile(file);
        // Kreiranje preview-a
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validacija
    if (!formData.title.trim()) {
      setError("Naziv je obavezan!");
      setLoading(false);
      return;
    }

    try {
      // Kreiraj FormData za upload
      const data = new FormData();
      data.append("kind", formData.kind);
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("location", formData.location);
      data.append("when", formData.when || new Date().toISOString());
      data.append("postedBy", formData.postedBy);
      
      // Dodaj sliku ako postoji
      if (imageFile) {
        data.append("image", imageFile);
      }

      console.log("📤 Šaljem podatke:");
      console.log("kind:", formData.kind);
      console.log("title:", formData.title);
      console.log("description:", formData.description);
      console.log("image:", imageFile ? "postoji" : "ne postoji");

      const response = await fetch("http://localhost:5000/api/items", {
        method: "POST",
        body: data
      });

      if (!response.ok) {
        throw new Error("Greška pri dodavanju oglasa");
      }

      // Reset forme
      setFormData({
        kind: isLost ? "LOST" : "FOUND",
        title: "",
        description: "",
        location: "",
        when: "",
        postedBy: user?.email || ""
      });
      setImageFile(null);
      setImagePreview(null);

      // Pozovi callback
      if (onSuccess) onSuccess();
      
      alert("Oglas je uspešno dodat!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div style={{
          background: "#f8d7da",
          color: "#721c24",
          padding: "12px",
          borderRadius: "10px",
          marginBottom: "20px",
          fontSize: "14px",
          border: "1px solid #f5c6cb"
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Naziv */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{
          display: "block",
          marginBottom: "8px",
          fontWeight: "600",
          color: "#2c3e50",
          fontSize: "14px"
        }}>
          Naziv predmeta *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder={isLost ? "Npr. Crveni ranac" : "Npr. Plava flašica"}
          required
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: "10px",
            border: "2px solid #e0e0e0",
            fontSize: "14px",
            outline: "none",
            transition: "border 0.2s ease"
          }}
          onFocus={(e) => e.target.style.borderColor = isLost ? "#e74c3c" : "#2ecc71"}
          onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
        />
      </div>

      {/* Opis */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{
          display: "block",
          marginBottom: "8px",
          fontWeight: "600",
          color: "#2c3e50",
          fontSize: "14px"
        }}>
          Opis
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Detaljnije opišite predmet..."
          rows="4"
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: "10px",
            border: "2px solid #e0e0e0",
            fontSize: "14px",
            outline: "none",
            transition: "border 0.2s ease",
            resize: "vertical"
          }}
          onFocus={(e) => e.target.style.borderColor = isLost ? "#e74c3c" : "#2ecc71"}
          onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
        />
      </div>

      {/* Lokacija */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{
          display: "block",
          marginBottom: "8px",
          fontWeight: "600",
          color: "#2c3e50",
          fontSize: "14px"
        }}>
          📍 Lokacija
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder={isLost ? "Gde je izgubljeno?" : "Gde je pronađeno?"}
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: "10px",
            border: "2px solid #e0e0e0",
            fontSize: "14px",
            outline: "none",
            transition: "border 0.2s ease"
          }}
          onFocus={(e) => e.target.style.borderColor = isLost ? "#e74c3c" : "#2ecc71"}
          onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
        />
      </div>

      {/* Datum */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{
          display: "block",
          marginBottom: "8px",
          fontWeight: "600",
          color: "#2c3e50",
          fontSize: "14px"
        }}>
          📅 Datum
        </label>
        <input
          type="date"
          name="when"
          value={formData.when}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: "10px",
            border: "2px solid #e0e0e0",
            fontSize: "14px",
            outline: "none",
            transition: "border 0.2s ease"
          }}
          onFocus={(e) => e.target.style.borderColor = isLost ? "#e74c3c" : "#2ecc71"}
          onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
        />
      </div>

      {/* Upload slike */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{
          display: "block",
          marginBottom: "8px",
          fontWeight: "600",
          color: "#2c3e50",
          fontSize: "14px"
        }}>
          📷 Slika predmeta
        </label>
        
        {imagePreview ? (
          <div style={{ position: "relative", marginBottom: "12px" }}>
            <img 
              src={imagePreview} 
              alt="Preview" 
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "10px",
                border: "2px solid #e0e0e0"
              }}
            />
            <button
              type="button"
              onClick={() => {
                setImageFile(null);
                setImagePreview(null);
              }}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "#e74c3c",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                cursor: "pointer",
                fontSize: "18px",
                fontWeight: "bold"
              }}
            >
              ×
            </button>
          </div>
        ) : (
          <label style={{
            display: "block",
            width: "100%",
            padding: "40px 20px",
            borderRadius: "10px",
            border: "2px dashed #e0e0e0",
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.2s ease",
            background: "#f8f9fa"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = isLost ? "#e74c3c" : "#2ecc71";
            e.currentTarget.style.background = "#f0f0f0";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#e0e0e0";
            e.currentTarget.style.background = "#f8f9fa";
          }}>
            <div style={{ fontSize: "40px", marginBottom: "8px" }}>📸</div>
            <div style={{ color: "#7f8c8d", fontSize: "14px" }}>
              Klikni da dodaš sliku
            </div>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              style={{ display: "none" }}
            />
          </label>
        )}
      </div>

      {/* Email kontakt */}
      <div style={{ marginBottom: "24px" }}>
        <label style={{
          display: "block",
          marginBottom: "8px",
          fontWeight: "600",
          color: "#2c3e50",
          fontSize: "14px"
        }}>
          📧 Email za kontakt
        </label>
        <input
          type="email"
          name="postedBy"
          value={formData.postedBy}
          onChange={handleChange}
          placeholder="vas.email@example.com"
          required
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: "10px",
            border: "2px solid #e0e0e0",
            fontSize: "14px",
            outline: "none",
            transition: "border 0.2s ease"
          }}
          onFocus={(e) => e.target.style.borderColor = isLost ? "#e74c3c" : "#2ecc71"}
          onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          background: isLost 
            ? "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)"
            : "linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)",
          color: "white",
          border: "none",
          borderRadius: "12px",
          padding: "16px",
          fontWeight: "600",
          fontSize: "16px",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1,
          transition: "all 0.2s ease"
        }}
      >
        {loading ? "Dodavanje..." : "✅ Objavi oglas"}
      </button>
    </form>
  );
}