import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
  });

  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage") {
      setForm((prev) => ({ ...prev, profileImage: files[0] }));
      setFileName(files[0]?.name || "");
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setMessage("❌ Lozinke se ne poklapaju.");
      return;
    }

    try {
      setUploading(true);

      const data = new FormData();
      data.append("firstName", form.firstName);
      data.append("lastName", form.lastName);
      data.append("email", form.email);
      data.append("password", form.password);
      if (form.profileImage) {
        data.append("profileImage", form.profileImage);
      }

      const res = await fetch(`${process.env.REACT_APP_API_URL}/register`, {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (res.ok) {
        setMessage("✅ Registracija uspešna! Sada se možete prijaviti.");
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          profileImage: null,
        });
        setFileName("");
      } else {
        setMessage("❌ " + (result.error || "Greška pri registraciji."));
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Došlo je do greške pri slanju.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Background Shapes */}
      <div style={styles.shape1}></div>
      <div style={styles.shape2}></div>
      <div style={styles.shape3}></div>

      {/* Back Button */}
      <Link to="/" style={styles.backButton}>
        <span style={styles.backIcon}>←</span>
        <span>Nazad na početnu</span>
      </Link>

      {/* Register Card */}
      <div style={styles.card}>
        <div style={styles.iconContainer}>
          <span style={styles.lockIcon}>✨</span>
        </div>

        <h2 style={styles.title}>Registruj se</h2>
        <p style={styles.subtitle}>Kreiraj nalog i pristupi portalu</p>

        {message && (
          <div style={{
            ...styles.message,
            backgroundColor: message.includes('✅') 
              ? 'rgba(16, 185, 129, 0.1)' 
              : 'rgba(239, 68, 68, 0.1)',
            color: message.includes('✅') ? '#059669' : '#dc2626',
            border: message.includes('✅') 
              ? '1px solid rgba(16, 185, 129, 0.3)' 
              : '1px solid rgba(239, 68, 68, 0.3)',
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* First Row - Name Fields */}
          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Ime</label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>👤</span>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Marko"
                  required
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Prezime</label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>👤</span>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Marković"
                  required
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email adresa</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>📧</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                style={styles.input}
                placeholder="vas@email.com"
                required
              />
            </div>
          </div>

          {/* Password Fields */}
          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Lozinka</label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Ponovi lozinku</label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </div>

          {/* Profile Image Upload */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Profilna slika (opciono)</label>
            <div style={styles.fileInputWrapper}>
              <input
                type="file"
                name="profileImage"
                accept="image/*"
                onChange={handleChange}
                style={styles.fileInput}
                id="fileInput"
              />
              <label htmlFor="fileInput" style={styles.fileLabel}>
                <span style={styles.uploadIcon}>📷</span>
                <span style={styles.fileName}>
                  {fileName || "Odaberi sliku"}
                </span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            style={{
              ...styles.submitButton,
              opacity: uploading ? 0.7 : 1,
              cursor: uploading ? 'not-allowed' : 'pointer',
            }}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <span style={styles.spinner}></span>
                Registrujem...
              </>
            ) : (
              <>
                <span style={styles.buttonIcon}>🚀</span>
                Registruj se
              </>
            )}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Već imaš nalog?{" "}
            <Link to="/login" style={styles.link}>
              Prijavi se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    width: '100vw',
    background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    padding: '40px 20px',
  },
  shape1: {
    position: 'absolute',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.15), rgba(249, 115, 22, 0.15))',
    top: '-150px',
    right: '-150px',
    filter: 'blur(80px)',
  },
  shape2: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.1), rgba(253, 186, 116, 0.1))',
    bottom: '-100px',
    left: '-100px',
    filter: 'blur(80px)',
  },
  shape3: {
    position: 'absolute',
    width: '350px',
    height: '350px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.08), rgba(253, 186, 116, 0.08))',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    filter: 'blur(100px)',
  },
  backButton: {
    position: 'absolute',
    top: '30px',
    left: '30px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    textDecoration: 'none',
    color: '#f97316',
    fontWeight: '600',
    fontSize: '14px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(251, 146, 60, 0.2)',
    zIndex: 100,
  },
  backIcon: {
    fontSize: '18px',
  },
  card: {
    position: 'relative',
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '40px',
    width: '100%',
    maxWidth: '600px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
    border: '1px solid rgba(251, 146, 60, 0.2)',
  },
  iconContainer: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  lockIcon: {
    fontSize: '56px',
    display: 'inline-block',
  },
  title: {
    fontSize: '32px',
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: '8px',
    background: 'linear-gradient(135deg, #f97316, #fb923c)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '15px',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: '28px',
  },
  message: {
    padding: '14px',
    borderRadius: '12px',
    marginBottom: '20px',
    fontSize: '14px',
    fontWeight: '500',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    fontSize: '16px',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '12px 14px 12px 42px',
    fontSize: '14px',
    border: '2px solid rgba(251, 146, 60, 0.2)',
    borderRadius: '10px',
    backgroundColor: 'white',
    outline: 'none',
    transition: 'all 0.3s ease',
    color: '#1f2937',
  },
  eyeButton: {
    position: 'absolute',
    right: '10px',
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '4px',
    opacity: 0.6,
    transition: 'opacity 0.2s',
  },
  fileInputWrapper: {
    position: 'relative',
  },
  fileInput: {
    position: 'absolute',
    opacity: 0,
    width: '100%',
    height: '100%',
    cursor: 'pointer',
  },
  fileLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: 'rgba(251, 146, 60, 0.05)',
    border: '2px dashed rgba(251, 146, 60, 0.3)',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  uploadIcon: {
    fontSize: '20px',
  },
  fileName: {
    fontSize: '14px',
    color: '#6b7280',
    fontWeight: '500',
  },
  submitButton: {
    width: '100%',
    padding: '15px',
    fontSize: '16px',
    fontWeight: '700',
    color: 'white',
    background: 'linear-gradient(135deg, #f97316, #fb923c)',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 25px rgba(251, 146, 60, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '4px',
  },
  buttonIcon: {
    fontSize: '20px',
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  footer: {
    marginTop: '20px',
    textAlign: 'center',
  },
  footerText: {
    fontSize: '14px',
    color: '#6b7280',
  },
  link: {
    color: '#f97316',
    fontWeight: '600',
    textDecoration: 'none',
  },
};

// Add animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  input:focus {
    border-color: #f97316 !important;
    box-shadow: 0 0 0 3px rgba(251, 146, 60, 0.1) !important;
  }
  
  button[type="submit"]:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 15px 35px rgba(251, 146, 60, 0.4) !important;
  }
  
  .backButton:hover {
    transform: translateX(-4px);
    background-color: rgba(255, 255, 255, 1) !important;
  }
  
  .eyeButton:hover {
    opacity: 1 !important;
  }
  
  .link:hover {
    text-decoration: underline !important;
  }
  
  label[for="fileInput"]:hover {
    background-color: rgba(251, 146, 60, 0.1) !important;
    border-color: rgba(251, 146, 60, 0.5) !important;
  }
  
  @media (max-width: 700px) {
    .card { 
      padding: 32px 24px !important; 
      max-width: 500px !important;
    }
    .backButton { 
      top: 20px !important; 
      left: 20px !important; 
    }
    .row { 
      grid-template-columns: 1fr !important; 
    }
  }
`;
document.head.appendChild(styleSheet);