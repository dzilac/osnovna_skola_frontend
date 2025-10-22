import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
    setSuccess("");
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validacija
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError("Sva polja su obavezna");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Nova lozinka mora imati najmanje 6 karaktera");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Nova lozinka i potvrda se ne poklapaju");
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError("Nova lozinka mora biti različita od trenutne");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/users/change-password", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Greška pri promeni lozinke");
      }

      setSuccess("Lozinka je uspešno promenjena!");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

      // Redirektuj nakon 2 sekunde
      setTimeout(() => {
        navigate(-1);
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <button 
          onClick={() => navigate(-1)} 
          style={styles.backButton}
          onMouseEnter={(e) => e.currentTarget.style.transform = "translateX(-5px)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "translateX(0)"}
        >
          ← Nazad
        </button>

        <div style={styles.header}>
          <div style={styles.iconWrapper}>
            🔒
          </div>
          <h2 style={styles.title}>Promeni lozinku</h2>
          <p style={styles.subtitle}>
            Unesite trenutnu lozinku i novu lozinku
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Trenutna lozinka */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Trenutna lozinka</label>
            <div style={styles.passwordWrapper}>
              <input
                type={showPasswords.current ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                style={styles.input}
                placeholder="Unesite trenutnu lozinku"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                style={styles.eyeButton}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#ffedd5"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                {showPasswords.current ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          {/* Nova lozinka */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nova lozinka</label>
            <div style={styles.passwordWrapper}>
              <input
                type={showPasswords.new ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                style={styles.input}
                placeholder="Unesite novu lozinku (min. 6 karaktera)"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                style={styles.eyeButton}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#ffedd5"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                {showPasswords.new ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          {/* Potvrda nove lozinke */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Potvrdi novu lozinku</label>
            <div style={styles.passwordWrapper}>
              <input
                type={showPasswords.confirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={styles.input}
                placeholder="Ponovite novu lozinku"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                style={styles.eyeButton}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#ffedd5"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                {showPasswords.confirm ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          {/* Error poruka */}
          {error && (
            <div style={styles.errorBox}>
              <span style={styles.errorIcon}>⚠️</span>
              {error}
            </div>
          )}

          {/* Success poruka */}
          {success && (
            <div style={styles.successBox}>
              <span style={styles.successIcon}>✓</span>
              {success}
            </div>
          )}

          {/* Submit dugme */}
          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitButton,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer"
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = "#ea580c";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(249, 115, 22, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#f97316";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(249, 115, 22, 0.3)";
            }}
          >
            {loading ? (
              <span style={styles.loadingText}>
                <span style={styles.spinner}></span>
                Promena u toku...
              </span>
            ) : (
              "Promeni lozinku"
            )}
          </button>
        </form>

        {/* Info box */}
        <div style={styles.infoBox}>
          <div style={styles.infoIcon}>💡</div>
          <div>
            <p style={styles.infoTitle}>Sigurnost lozinke</p>
            <ul style={styles.infoList}>
              <li>Minimum 6 karaktera</li>
              <li>Koristite kombinaciju slova i brojeva</li>
              <li>Ne delite lozinku sa drugima</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "calc(100vh - 70px)",
    background: "linear-gradient(135deg, #fff7ed 0%, #ffffff 50%, #ffedd5 100%)",
    padding: "40px 20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    backgroundColor: "white",
    borderRadius: "20px",
    boxShadow: "0 10px 40px rgba(249, 115, 22, 0.15)",
    padding: "40px",
    maxWidth: "500px",
    width: "100%",
    animation: "slideUp 0.5s ease-out",
    border: "2px solid #fed7aa"
  },
  backButton: {
    background: "none",
    border: "none",
    color: "#9a3412",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "20px",
    transition: "all 0.3s ease",
    padding: "8px 0"
  },
  header: {
    textAlign: "center",
    marginBottom: "30px"
  },
  iconWrapper: {
    fontSize: "48px",
    marginBottom: "16px",
    animation: "bounce 2s ease-in-out infinite"
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "8px"
  },
  subtitle: {
    fontSize: "14px",
    color: "#9a3412",
    margin: 0
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#9a3412"
  },
  passwordWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center"
  },
  input: {
    width: "100%",
    padding: "12px 45px 12px 16px",
    fontSize: "15px",
    border: "2px solid #fed7aa",
    borderRadius: "12px",
    outline: "none",
    transition: "all 0.3s ease",
    fontFamily: "inherit",
    color: "#9a3412"
  },
  eyeButton: {
    position: "absolute",
    right: "12px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "18px",
    padding: "4px 8px",
    borderRadius: "6px",
    transition: "all 0.2s ease"
  },
  errorBox: {
    backgroundColor: "#fee2e2",
    border: "1px solid #fecaca",
    borderRadius: "10px",
    padding: "12px 16px",
    color: "#dc2626",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    animation: "shake 0.5s ease"
  },
  errorIcon: {
    fontSize: "18px"
  },
  successBox: {
    backgroundColor: "#d1fae5",
    border: "1px solid #a7f3d0",
    borderRadius: "10px",
    padding: "12px 16px",
    color: "#059669",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    animation: "slideDown 0.5s ease"
  },
  successIcon: {
    fontSize: "18px",
    fontWeight: "bold"
  },
  submitButton: {
    backgroundColor: "#f97316",
    color: "white",
    border: "none",
    borderRadius: "12px",
    padding: "14px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(249, 115, 22, 0.3)",
    marginTop: "8px"
  },
  loadingText: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px"
  },
  spinner: {
    width: "16px",
    height: "16px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTop: "2px solid white",
    borderRadius: "50%",
    display: "inline-block",
    animation: "spin 0.8s linear infinite"
  },
  infoBox: {
    marginTop: "30px",
    padding: "16px",
    backgroundColor: "#fff7ed",
    borderRadius: "12px",
    display: "flex",
    gap: "12px",
    border: "2px solid #fed7aa"
  },
  infoIcon: {
    fontSize: "24px"
  },
  infoTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#9a3412",
    marginBottom: "8px"
  },
  infoList: {
    margin: 0,
    paddingLeft: "20px",
    fontSize: "13px",
    color: "#c2410c",
    lineHeight: "1.8"
  }
};

// Add animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
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

  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  input:focus {
    border-color: #f97316 !important;
    box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1) !important;
  }

  input:disabled {
    background-color: #fff7ed;
    cursor: not-allowed;
  }
`;
document.head.appendChild(styleSheet);