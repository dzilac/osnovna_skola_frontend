import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Home1() {
  const [hoveredButton, setHoveredButton] = React.useState(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic'
    });
  }, []);

  return (
    <div style={styles.container}>
      {/* Animated Background Shapes */}
      <div style={styles.shape1}></div>
      <div style={styles.shape2}></div>
      <div style={styles.shape3}></div>

      {/* Two Column Layout */}
      <div style={styles.wrapper}>
        {/* Left Column - Info */}
        <div style={styles.leftColumn}>
          {/* Logo */}
          <div style={styles.logoContainer} data-aos="fade-down">
            <div style={styles.logoIcon}>🏫</div>
            <h2 style={styles.schoolName}>Školski Portal</h2>
          </div>

          {/* Main Heading */}
          <h1 style={styles.title} data-aos="fade-up" data-aos-delay="100">
            Dobrodošli u <br />
            <span style={styles.titleGradient}>osnovnu školu</span>
          </h1>

          <p style={styles.subtitle} data-aos="fade-up" data-aos-delay="200">
            Sve što vam treba za praćenje školskih aktivnosti na jednom mestu
          </p>

          {/* Features List */}
          <div style={styles.featuresList} data-aos="fade-up" data-aos-delay="300">
            <div style={styles.featureItem}>
              <span style={styles.featureIcon}>✓</span>
              <span style={styles.featureText}>Izgubljeno i nađeno</span>
            </div>
            <div style={styles.featureItem}>
              <span style={styles.featureIcon}>✓</span>
              <span style={styles.featureText}>Vannastavne aktivnosti</span>
            </div>
            <div style={styles.featureItem}>
              <span style={styles.featureIcon}>✓</span>
              <span style={styles.featureText}>Privatni časovi</span>
            </div>
            <div style={styles.featureItem}>
              <span style={styles.featureIcon}>✓</span>
              <span style={styles.featureText}>Praćenje deteta</span>
            </div>
            <div style={styles.featureItem}>
              <span style={styles.featureIcon}>✓</span>
              <span style={styles.featureText}>Napredak deteta</span>
            </div>
            <div style={styles.featureItem}>
              <span style={styles.featureIcon}>✓</span>
              <span style={styles.featureText}>AI podrška</span>
            </div>
          </div>
        </div>

        {/* Right Column - Login/Register */}
        <div style={styles.rightColumn}>
          <div style={styles.authCard} data-aos="fade-left" data-aos-delay="200">
            <h3 style={styles.authTitle}>Pristupite portalu</h3>
            <p style={styles.authSubtitle}>Prijavite se ili kreirajte nalog</p>

            {/* Buttons */}
            <div style={styles.buttonContainer}>
              <Link 
                to="/login" 
                style={{
                  ...styles.button,
                  ...styles.buttonPrimary,
                  transform: hoveredButton === 'login' ? 'translateY(-4px)' : 'translateY(0)',
                  boxShadow: hoveredButton === 'login' 
                    ? '0 20px 40px rgba(251, 146, 60, 0.4)' 
                    : '0 10px 30px rgba(251, 146, 60, 0.3)',
                }}
                onMouseEnter={() => setHoveredButton('login')}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <span style={styles.buttonIcon}>🔐</span>
                Prijavi se
              </Link>

              <Link 
                to="/register" 
                style={{
                  ...styles.button,
                  ...styles.buttonSecondary,
                  transform: hoveredButton === 'register' ? 'translateY(-4px)' : 'translateY(0)',
                  boxShadow: hoveredButton === 'register' 
                    ? '0 20px 40px rgba(0, 0, 0, 0.15)' 
                    : '0 5px 15px rgba(0, 0, 0, 0.08)',
                }}
                onMouseEnter={() => setHoveredButton('register')}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <span style={styles.buttonIcon}>✨</span>
                Registruj se
              </Link>
            </div>

            {/* Info Stats */}
            <div style={styles.statsContainer}>
              <div style={styles.statItem}>
                <div style={styles.statNumber}>500+</div>
                <div style={styles.statLabel}>Porodica</div>
              </div>
              <div style={styles.statDivider}></div>
              <div style={styles.statItem}>
                <div style={styles.statNumber}>24/7</div>
                <div style={styles.statLabel}>Pristup</div>
              </div>
              <div style={styles.statDivider}></div>
              <div style={styles.statItem}>
                <div style={styles.statNumber}>100%</div>
                <div style={styles.statLabel}>Sigurno</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    width: '100%',
    background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    padding: '40px 20px',
    boxSizing: 'border-box',
  },
  shape1: {
    position: 'absolute',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.15), rgba(249, 115, 22, 0.15))',
    top: '-200px',
    left: '-200px',
    filter: 'blur(80px)',
    animation: 'float 20s ease-in-out infinite',
  },
  shape2: {
    position: 'absolute',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.1), rgba(253, 186, 116, 0.1))',
    bottom: '-150px',
    right: '-150px',
    filter: 'blur(80px)',
    animation: 'float 15s ease-in-out infinite reverse',
  },
  shape3: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.08), rgba(253, 186, 116, 0.08))',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    filter: 'blur(100px)',
    animation: 'pulse 10s ease-in-out infinite',
  },
  wrapper: {
    position: 'relative',
    zIndex: 10,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '60px',
    maxWidth: '1400px',
    width: '100%',
    alignItems: 'center',
    padding: '0 40px',
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: '32px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  logoIcon: {
    fontSize: '42px',
    filter: 'drop-shadow(0 4px 8px rgba(251, 146, 60, 0.3))',
  },
  schoolName: {
    fontSize: '26px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #f97316, #fb923c)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0,
  },
  title: {
    fontSize: '56px',
    fontWeight: '900',
    color: '#1f2937',
    marginBottom: '20px',
    lineHeight: '1.1',
  },
  titleGradient: {
    background: 'linear-gradient(135deg, #f97316, #fb923c, #fdba74)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'inline-block',
  },
  subtitle: {
    fontSize: '18px',
    color: '#6b7280',
    marginBottom: '36px',
    lineHeight: '1.6',
    fontWeight: '400',
  },
  featuresList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(10px)',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    border: '1px solid rgba(251, 146, 60, 0.1)',
  },
  featureIcon: {
    fontSize: '16px',
    color: '#f97316',
    fontWeight: '700',
    backgroundColor: 'rgba(251, 146, 60, 0.15)',
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '6px',
  },
  featureText: {
    fontSize: '14px',
    color: '#374151',
    fontWeight: '500',
  },
  rightColumn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(20px)',
    padding: '48px',
    borderRadius: '24px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(251, 146, 60, 0.2)',
    width: '100%',
    maxWidth: '480px',
  },
  authTitle: {
    fontSize: '32px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #f97316, #fb923c)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '12px',
    textAlign: 'center',
  },
  authSubtitle: {
    fontSize: '16px',
    color: '#6b7280',
    marginBottom: '32px',
    textAlign: 'center',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '32px',
  },
  button: {
    width: '100%',
    padding: '18px 32px',
    borderRadius: '14px',
    fontSize: '18px',
    fontWeight: '700',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
  },
  buttonPrimary: {
    background: 'linear-gradient(135deg, #f97316, #fb923c)',
    color: 'white',
    boxShadow: '0 10px 30px rgba(251, 146, 60, 0.3)',
  },
  buttonSecondary: {
    backgroundColor: 'white',
    color: '#f97316',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
    border: '2px solid rgba(251, 146, 60, 0.2)',
  },
  buttonIcon: {
    fontSize: '22px',
  },
  statsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: '24px 0 0',
    borderTop: '1px solid rgba(251, 146, 60, 0.15)',
  },
  statItem: {
    textAlign: 'center',
  },
  statNumber: {
    fontSize: '24px',
    fontWeight: '900',
    background: 'linear-gradient(135deg, #f97316, #fb923c)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '12px',
    color: '#6b7280',
    fontWeight: '500',
  },
  statDivider: {
    width: '1px',
    height: '40px',
    backgroundColor: 'rgba(251, 146, 60, 0.15)',
  },
};

// Add animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes float {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    33% { transform: translate(30px, -50px) rotate(5deg); }
    66% { transform: translate(-20px, 20px) rotate(-5deg); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
    50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.8; }
  }
  
  * {
    box-sizing: border-box;
  }
  
  body {
    overflow-x: hidden;
    margin: 0;
    padding: 0;
  }
  
  @media (max-width: 1200px) {
    [style*="grid-template-columns: 1fr 1fr"] { 
      grid-template-columns: 1fr !important;
      gap: 40px !important;
    }
  }
  
  @media (max-width: 768px) {
    h1 { 
      font-size: 36px !important; 
      line-height: 1.2 !important;
    }
    
    [style*="fontSize: '26px'"] {
      font-size: 20px !important;
    }
    
    [style*="fontSize: '32px'"] {
      font-size: 24px !important;
    }
    
    [style*="padding: '48px'"] {
      padding: 32px 24px !important;
    }
    
    [style*="gridTemplateColumns: 'repeat(2, 1fr)'"] {
      grid-template-columns: 1fr !important;
    }
    
    [style*="maxWidth: '1400px'"] {
      padding: 0 20px !important;
    }
  }
  
  @media (max-width: 480px) {
    h1 { 
      font-size: 28px !important; 
    }
    
    [style*="fontSize: '42px'"] {
      font-size: 32px !important;
    }
    
    [style*="fontSize: '18px'"][style*="padding: '18px"] {
      font-size: 16px !important;
      padding: 14px 24px !important;
    }
  }
`;
document.head.appendChild(styleSheet);