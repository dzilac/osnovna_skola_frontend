import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';


export default function Home2() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
    });
  }, []);

  return (
    <div style={styles.container}>
      {/* Hero Section with Video Background */}
      <div style={styles.hero}>
        {/* Video Background Container */}
        <div style={styles.videoContainer}>
          <video
            autoPlay
            loop
            muted
            playsInline
            style={styles.video}
          >
            <source src="/video/childrenhero.mp4" type="video/mp4" />
          </video>
          <div style={styles.videoOverlay}></div>
        </div>

        {/* Hero Content */}
        <div style={styles.heroContent}>
          <div 
            style={styles.badge}
            data-aos="fade-down"
            data-aos-delay="100"
          >
            <span style={styles.sparkle}>✨</span>
            <span style={styles.badgeText}>Dobrodošli u moderan školski portal</span>
            <span style={styles.sparkle}>✨</span>
          </div>
          
          <h1 
            style={styles.title}
            data-aos="zoom-in"
            data-aos-delay="300"
          >
            Sve na jednom mestu
          </h1>
          
          <p 
            style={styles.subtitle}
            data-aos="fade-up"
            data-aos-delay="500"
          >
            Brz i jednostavan uvid u školske aktivnosti vaše dece
          </p>

          {/* Animated Scroll Indicator */}
          <div style={styles.scrollIndicator} data-aos="fade-up" data-aos-delay="700">
            <div style={styles.mouse}>
              <div style={styles.wheel}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div style={styles.featuresSection}>
        <div style={styles.sectionHeader}>
          <h2 
            style={styles.sectionTitle}
            data-aos="fade-up"
          >
            Šta nudimo?
          </h2>
          <div 
            style={styles.divider}
            data-aos="zoom-in"
            data-aos-delay="200"
          ></div>
          <p 
            style={styles.sectionSubtitle}
            data-aos="fade-up"
            data-aos-delay="300"
          >
            Istražite sve mogućnosti našeg portala
          </p>
        </div>

        <div style={styles.grid}>
          <FeatureCard 
            to="/izgubljeno-nadjeno"
            icon="📦"
            title="Izgubljeno-nađeno"
            description="Pronađi izgubljene stvari brzo i lako"
            color="#f97316"
            delay="100"
          />
          
          <FeatureCard 
            to="/vannastavne-aktivnosti"
            icon="🎨"
            title="Vannastavne aktivnosti"
            description="Umetnost, sport, nauka i više"
            color="#fb923c"
            delay="200"
          />
          
          <FeatureCard 
            to="/privatni-casovi"
            icon="📚"
            title="Privatni časovi"
            description="Dodatna pomoć u učenju"
            color="#fdba74"
            delay="300"
          />
          
          <FeatureCard 
            to="/pronadji-dete"
            icon="📍"
            title="Pronađi dete"
            description="Uvek znaj gde je tvoje dete"
            color="#f59e0b"
            delay="400"
          />
        </div>
      </div>

      {/* Stats Section */}
      <div style={styles.statsSection}>
        <div style={styles.statsGrid}>
          <StatCard number="500+" label="Učenika" icon="👨‍🎓" delay="100" />
          <StatCard number="50+" label="Aktivnosti" icon="🎯" delay="200" />
          <StatCard number="100+" label="Roditelja" icon="👨‍👩‍👧‍👦" delay="300" />
          <StatCard number="24/7" label="Podrška" icon="💬" delay="400" />
        </div>
      </div>

      {/* Interactive CTA Section */}
      <div style={styles.ctaSection}>
        <div 
          style={styles.ctaCard}
          data-aos="zoom-in"
          data-aos-duration="800"
        >
          <div style={styles.ctaIcon}>🏆</div>
          <h2 style={styles.ctaTitle}>
            Istražite sve mogućnosti
          </h2>
          <p style={styles.ctaText}>
            Više od portala - tvoj partner u školskom životu deteta
          </p>
          
          {/* Quick Action Buttons */}
          <div style={styles.quickActions}>
            <Link to="/vannastavne-aktivnosti" style={styles.quickButton}>
              <span style={styles.quickIcon}>🎨</span>
              <span>Aktivnosti</span>
            </Link>
            <Link to="/privatni-casovi" style={styles.quickButton}>
              <span style={styles.quickIcon}>📚</span>
              <span>Časovi</span>
            </Link>
            <Link to="/pronadji-dete" style={styles.quickButton}>
              <span style={styles.quickIcon}>📍</span>
              <span>Lokacija</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Particles */}
      <div style={styles.particles}>
        <div style={{...styles.particle, top: '10%', left: '10%', animationDelay: '0s'}}></div>
        <div style={{...styles.particle, top: '20%', right: '15%', animationDelay: '2s'}}></div>
        <div style={{...styles.particle, bottom: '15%', left: '20%', animationDelay: '4s'}}></div>
        <div style={{...styles.particle, top: '60%', right: '10%', animationDelay: '6s'}}></div>
        <div style={{...styles.particle, bottom: '30%', right: '25%', animationDelay: '3s'}}></div>
      </div>
    </div>
  );
}

function FeatureCard({ to, icon, title, description, color, delay }) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Link 
      to={to}
      style={{
        ...styles.card,
        transform: isHovered ? 'translateY(-15px) scale(1.03)' : 'translateY(0) scale(1)',
        boxShadow: isHovered ? `0 25px 50px ${color}30` : '0 4px 15px rgba(0,0,0,0.1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-aos="fade-up"
      data-aos-delay={delay}
    >
      <div style={{
        ...styles.iconBox, 
        backgroundColor: color,
        transform: isHovered ? 'rotate(10deg) scale(1.1)' : 'rotate(0) scale(1)',
      }}>
        <span style={styles.icon}>{icon}</span>
      </div>
      
      <h3 style={{
        ...styles.cardTitle,
        background: isHovered ? `linear-gradient(135deg, ${color}, #fdba74)` : 'none',
        WebkitBackgroundClip: isHovered ? 'text' : 'initial',
        WebkitTextFillColor: isHovered ? 'transparent' : '#1f2937',
      }}>
        {title}
      </h3>
      
      <p style={styles.cardDescription}>
        {description}
      </p>
      
      <div style={{
        ...styles.cardLink,
        color: color,
        transform: isHovered ? 'translateX(10px)' : 'translateX(0)',
      }}>
        Saznaj više →
      </div>

      {/* Card Glow Effect */}
      {isHovered && (
        <div style={{
          ...styles.cardGlow,
          background: `radial-gradient(circle at center, ${color}20, transparent)`,
        }}></div>
      )}
    </Link>
  );
}

function StatCard({ number, label, icon, delay }) {
  const [count, setCount] = React.useState(0);
  const [hasAnimated, setHasAnimated] = React.useState(false);

  React.useEffect(() => {
    if (hasAnimated) return;
    
    const handleScroll = () => {
      const element = document.getElementById(`stat-${label}`);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight && !hasAnimated) {
          setHasAnimated(true);
          animateCount();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasAnimated]);

  const animateCount = () => {
    const target = parseInt(number.replace('+', ''));
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 30);
  };

  return (
    <div 
      id={`stat-${label}`}
      style={styles.statCard}
      data-aos="zoom-in"
      data-aos-delay={delay}
    >
      <div style={styles.statIcon}>{icon}</div>
      <div style={styles.statNumber}>
        {count}{number.includes('+') ? '+' : ''}{number.includes('/') ? '/7' : ''}
      </div>
      <div style={styles.statLabel}>{label}</div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)',
    position: 'relative',
    overflow: 'hidden',
  },
  hero: {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  videoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    zIndex: 1,
  },
  video: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    minWidth: '100%',
    minHeight: '100%',
    width: 'auto',
    height: 'auto',
    transform: 'translate(-50%, -50%)',
    objectFit: 'cover',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, rgba(255, 247, 237, 0.85), rgba(254, 215, 170, 0.85))',
    backdropFilter: 'blur(3px)',
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    maxWidth: '900px',
    margin: '0 auto',
    textAlign: 'center',
    padding: '0 20px',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(15px)',
    padding: '14px 28px',
    borderRadius: '50px',
    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
    marginBottom: '40px',
    border: '2px solid rgba(251, 146, 60, 0.3)',
  },
  sparkle: {
    fontSize: '16px',
    animation: 'sparkle 2s ease-in-out infinite',
  },
  badgeText: {
    fontSize: '15px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #f97316, #fb923c)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '0.5px',
  },
  title: {
    fontSize: '80px',
    fontWeight: '900',
    marginBottom: '30px',
    background: 'linear-gradient(135deg, #f97316, #fb923c, #fdba74)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    lineHeight: '1.1',
    textShadow: '0 4px 20px rgba(249, 115, 22, 0.3)',
  },
  subtitle: {
    fontSize: '26px',
    color: '#374151',
    marginBottom: '50px',
    fontWeight: '400',
    textShadow: '0 2px 10px rgba(255, 255, 255, 0.8)',
  },
  scrollIndicator: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    marginTop: '60px',
  },
  mouse: {
    width: '28px',
    height: '45px',
    border: '3px solid #f97316',
    borderRadius: '20px',
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  wheel: {
    width: '4px',
    height: '10px',
    background: '#f97316',
    borderRadius: '2px',
    position: 'absolute',
    top: '8px',
    left: '50%',
    transform: 'translateX(-50%)',
    animation: 'scroll 1.5s ease-in-out infinite',
  },
  scrollText: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#f97316',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  featuresSection: {
    padding: '100px 20px',
    maxWidth: '1400px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 2,
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '60px',
  },
  sectionTitle: {
    fontSize: '48px',
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: '16px',
  },
  sectionSubtitle: {
    fontSize: '18px',
    color: '#6b7280',
    marginTop: '16px',
  },
  divider: {
    width: '120px',
    height: '5px',
    background: 'linear-gradient(135deg, #f97316, #fb923c)',
    margin: '0 auto',
    borderRadius: '3px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    maxWidth: '1300px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '18px',
    padding: '28px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    textDecoration: 'none',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid rgba(251, 146, 60, 0.1)',
  },
  iconBox: {
    display: 'inline-flex',
    padding: '14px',
    borderRadius: '14px',
    marginBottom: '20px',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  },
  icon: {
    fontSize: '42px',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '12px',
    transition: 'all 0.3s ease',
  },
  cardDescription: {
    color: '#6b7280',
    lineHeight: '1.6',
    marginBottom: '16px',
    fontSize: '14px',
  },
  cardLink: {
    fontSize: '13px',
    fontWeight: '700',
    marginTop: '20px',
    display: 'inline-block',
    transition: 'transform 0.3s ease',
  },
  cardGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    animation: 'glow 2s ease-in-out infinite',
  },
  statsSection: {
    background: 'linear-gradient(135deg, #f97316, #fb923c)',
    padding: '80px 20px',
    position: 'relative',
    zIndex: 2,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '40px',
    maxWidth: '1200px',
    margin: '0 auto',
    textAlign: 'center',
  },
  statCard: {
    color: 'white',
  },
  statIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  statNumber: {
    fontSize: '64px',
    fontWeight: '900',
    marginBottom: '12px',
    textShadow: '0 4px 15px rgba(0,0,0,0.2)',
  },
  statLabel: {
    fontSize: '20px',
    fontWeight: '600',
    opacity: '0.95',
    letterSpacing: '0.5px',
  },
  ctaSection: {
    padding: '100px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 2,
  },
  ctaCard: {
    background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.15), rgba(253, 186, 116, 0.15))',
    borderRadius: '30px',
    padding: '70px 40px',
    textAlign: 'center',
    boxShadow: '0 25px 70px rgba(0,0,0,0.15)',
    border: '2px solid rgba(251, 146, 60, 0.2)',
    backdropFilter: 'blur(10px)',
  },
  ctaIcon: {
    fontSize: '72px',
    marginBottom: '28px',
    animation: 'bounce 2s ease-in-out infinite',
  },
  ctaTitle: {
    fontSize: '44px',
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: '20px',
  },
  ctaText: {
    fontSize: '22px',
    color: '#6b7280',
    marginBottom: '40px',
    maxWidth: '700px',
    margin: '0 auto 40px',
  },
  quickActions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',
  },
  quickButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 32px',
    background: 'white',
    color: '#f97316',
    borderRadius: '50px',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '16px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    border: '2px solid rgba(251, 146, 60, 0.2)',
  },
  quickIcon: {
    fontSize: '24px',
  },
  particles: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 1,
  },
  particle: {
    position: 'absolute',
    width: '10px',
    height: '10px',
    background: 'rgba(251, 146, 60, 0.3)',
    borderRadius: '50%',
    animation: 'float 8s ease-in-out infinite',
  },
};

// Add animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes scroll {
    0%, 20% { transform: translateX(-50%) translateY(0); opacity: 0; }
    50% { opacity: 1; }
    80%, 100% { transform: translateX(-50%) translateY(20px); opacity: 0; }
  }
  
  @keyframes sparkle {
    0%, 100% { transform: scale(1) rotate(0deg); }
    50% { transform: scale(1.2) rotate(180deg); }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0) translateX(0); }
    33% { transform: translateY(-30px) translateX(20px); }
    66% { transform: translateY(-15px) translateX(-20px); }
  }
  
  @keyframes glow {
    0%, 100% { opacity: 0; }
    50% { opacity: 1; }
  }
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-15px); }
  }
  
  .quickButton:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 10px 30px rgba(249, 115, 22, 0.3) !important;
    background: linear-gradient(135deg, #f97316, #fb923c) !important;
    color: white !important;
  }
  
  @media (max-width: 768px) {
    h1 { font-size: 48px !important; }
    .sectionTitle { font-size: 36px !important; }
    .quickActions { flex-direction: column; width: 100%; max-width: 300px; margin: 0 auto; }
    .quickButton { width: 100%; justify-content: center; }
  }
`;
document.head.appendChild(styleSheet);