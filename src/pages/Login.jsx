import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log('📦 Backend odgovor:', data);

      if (res.ok) {
        setMessage("✅ Uspješno prijavljeni!");
        
        const userWithToken = {
          ...data.user,
          token: data.token
        };
        
        console.log('💾 Čuvam u localStorage:', userWithToken);
        login(userWithToken);

        // Role-based redirect
        if (data.user.role === "Dete") {
          navigate("/dete-dashboard");
        } else if (data.user.role === "Roditelj") {
          navigate("/roditelj-dashboard");
        } else if (data.user.role === "Admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/home");
        }
      } else {
        setMessage("❌ " + (data.error || "Neispravni podaci."));
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Greška prilikom prijave.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Background Shapes */}
      <div style={styles.shape1}></div>
      <div style={styles.shape2}></div>

      {/* Back Button */}
      <Link to="/" style={styles.backButton}>
        <span style={styles.backIcon}>←</span>
        <span>Nazad na početnu</span>
      </Link>

      {/* Login Card */}
      <div style={styles.card}>
        <div style={styles.iconContainer}>
          <span style={styles.lockIcon}>🔐</span>
        </div>

        <h2 style={styles.title}>Prijavi se</h2>
        <p style={styles.subtitle}>Unesite svoje podatke za pristup</p>

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

          <button 
            type="submit" 
            style={{
              ...styles.submitButton,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span style={styles.spinner}></span>
                Prijavljujem...
              </>
            ) : (
              <>
                <span style={styles.buttonIcon}>🚀</span>
                Prijavi se
              </>
            )}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Nemaš nalog?{" "}
            <Link to="/register" style={styles.link}>
              Registruj se
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
    padding: '20px',
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
    padding: '48px',
    width: '100%',
    maxWidth: '480px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
    border: '1px solid rgba(251, 146, 60, 0.2)',
  },
  iconContainer: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  lockIcon: {
    fontSize: '56px',
    display: 'inline-block',
    animation: 'bounce 2s infinite',
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
    marginBottom: '32px',
  },
  message: {
    padding: '16px',
    borderRadius: '12px',
    marginBottom: '24px',
    fontSize: '14px',
    fontWeight: '500',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
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
    left: '16px',
    fontSize: '18px',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '14px 16px 14px 48px',
    fontSize: '15px',
    border: '2px solid rgba(251, 146, 60, 0.2)',
    borderRadius: '12px',
    backgroundColor: 'white',
    outline: 'none',
    transition: 'all 0.3s ease',
    color: '#1f2937',
  },
  eyeButton: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '4px',
    opacity: 0.6,
    transition: 'opacity 0.2s',
  },
  submitButton: {
    width: '100%',
    padding: '16px',
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
    marginTop: '8px',
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
    marginTop: '24px',
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
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
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
  
  @media (max-width: 600px) {
    .card { padding: 32px 24px !important; }
    .backButton { top: 20px !important; left: 20px !important; }
  }
`;
document.head.appendChild(styleSheet);