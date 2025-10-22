import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    proizvod: [
      { name: 'Početna', path: '/' },
      { name: 'Kvizovi', path: '/quizzes' },
      { name: 'Dashboard', path: '/parent-dashboard' },
      { name: 'Praćenje', path: '/track-child' }
    ],
    podrska: [
      { name: 'Kontakt', path: '/contact' },
      { name: 'Pomoć', path: '/help' },
      { name: 'FAQ', path: '/faq' },
      { name: 'Dokumentacija', path: '/docs' }
    ],
    pravno: [
      { name: 'Uslovi korišćenja', path: '/terms' },
      { name: 'Privatnost', path: '/privacy' },
      { name: 'Politika kolačića', path: '/cookies' },
      { name: 'GDPR', path: '/gdpr' }
    ]
  };

  const socialLinks = [
    { name: 'Facebook', icon: '📘', url: 'https://facebook.com', color: '#1877f2' },
    { name: 'Instagram', icon: '📸', url: 'https://instagram.com', color: '#e4405f' },
    { name: 'Twitter', icon: '🐦', url: 'https://twitter.com', color: '#1da1f2' },
    { name: 'YouTube', icon: '📺', url: 'https://youtube.com', color: '#ff0000' },
    { name: 'LinkedIn', icon: '💼', url: 'https://linkedin.com', color: '#0a66c2' }
  ];

  return (
    <>
      <footer style={{
        background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Dekorativni background elementi */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(255,154,86,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-150px',
          left: '-150px',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(102,126,234,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }}></div>

        {/* Wave effect na vrhu */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          overflow: 'hidden',
          lineHeight: 0
        }}>
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{
            position: 'relative',
            display: 'block',
            width: 'calc(100% + 1.3px)',
            height: '60px'
          }}>
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
              style={{ fill: '#fff5f0' }}></path>
          </svg>
        </div>

        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '80px 20px 20px',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Glavni sadržaj */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth >= 992 ? 'repeat(4, 1fr)' : window.innerWidth >= 768 ? 'repeat(2, 1fr)' : '1fr',
            gap: '40px',
            marginBottom: '60px'
          }}>
            {/* Logo i opis */}
            <div style={{ gridColumn: window.innerWidth >= 992 ? 'span 1' : 'span 1' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: 'linear-gradient(135deg, #ff9a56 0%, #ff7f3f 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  boxShadow: '0 8px 20px rgba(255,154,86,0.3)'
                }}>
                  🎓
                </div>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  margin: 0,
                  background: 'linear-gradient(135deg, #ff9a56 0%, #ff7f3f 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Invictus
                </h3>
              </div>
              <p style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '15px',
                lineHeight: '1.6',
                marginBottom: '20px'
              }}>
                Moderna platforma za praćenje napretka učenika. Povežite roditelje, učenike i školu na jedan jednostavan način.
              </p>
              {/* Social media */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      textDecoration: 'none',
                      transition: 'all 0.3s',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.background = social.color;
                      e.currentTarget.style.boxShadow = `0 8px 20px ${social.color}40`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    title={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

          {/* Proizvod */}
          <div>
            <h4 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '20px',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '20px' }}>🚀</span>
              Proizvod
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {footerLinks.proizvod.map((link, index) => (
                <li key={index} style={{ marginBottom: '12px' }}>
                  <button
                    onClick={() => navigate(link.path)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '15px',
                      cursor: 'pointer',
                      padding: '4px 0',
                      transition: 'all 0.2s',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#ff9a56';
                      e.currentTarget.style.paddingLeft = '8px';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                      e.currentTarget.style.paddingLeft = '0';
                    }}
                  >
                    <span style={{ fontSize: '12px' }}>▸</span>
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Podrška */}
          <div>
            <h4 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '20px',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '20px' }}>💬</span>
              Podrška
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {footerLinks.podrska.map((link, index) => (
                <li key={index} style={{ marginBottom: '12px' }}>
                  <button
                    onClick={() => navigate(link.path)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '15px',
                      cursor: 'pointer',
                      padding: '4px 0',
                      transition: 'all 0.2s',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#ff9a56';
                      e.currentTarget.style.paddingLeft = '8px';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                      e.currentTarget.style.paddingLeft = '0';
                    }}
                  >
                    <span style={{ fontSize: '12px' }}>▸</span>
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Pravno */}
          <div>
            <h4 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '20px',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '20px' }}>⚖️</span>
              Pravno
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {footerLinks.pravno.map((link, index) => (
                <li key={index} style={{ marginBottom: '12px' }}>
                  <button
                    onClick={() => navigate(link.path)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '15px',
                      cursor: 'pointer',
                      padding: '4px 0',
                      transition: 'all 0.2s',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#ff9a56';
                      e.currentTarget.style.paddingLeft = '8px';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                      e.currentTarget.style.paddingLeft = '0';
                    }}
                  >
                    <span style={{ fontSize: '12px' }}>▸</span>
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter section */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '40px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth >= 768 ? '1fr auto' : '1fr',
            gap: '20px',
            alignItems: 'center'
          }}>
            <div>
              <h4 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span style={{ fontSize: '24px' }}>📧</span>
                Prijavite se na newsletter
              </h4>
              <p style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '14px',
                margin: 0
              }}>
                Budite u toku sa najnovijim vestima i ažuriranjima
              </p>
            </div>
            <div style={{
              display: 'flex',
              gap: '10px',
              flexWrap: window.innerWidth < 768 ? 'wrap' : 'nowrap'
            }}>
              
              <button
                style={{
                  padding: '12px 30px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #ff9a56 0%, #ff7f3f 100%)',
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(255,154,86,0.3)',
                  transition: 'all 0.3s',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(255,154,86,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(255,154,86,0.3)';
                }}
              >
                Prijavi se
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          marginBottom: '30px'
        }}></div>

        {/* Bottom section */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            <p style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: '14px',
              margin: 0
            }}>
              © {currentYear} EduTrack. Sva prava zadržana.
            </p>
            <div style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center'
            }}>
              <span style={{
                padding: '4px 12px',
                borderRadius: '20px',
                background: 'rgba(76, 175, 80, 0.2)',
                color: '#4caf50',
                fontSize: '12px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#4caf50',
                  animation: 'pulse 2s infinite'
                }}></span>
                Online
              </span>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            color: 'rgba(255,255,255,0.6)',
            fontSize: '14px'
          }}>
            <span>Napravljeno sa</span>
            <span style={{
              fontSize: '20px',
              animation: 'heartbeat 1.5s infinite'
            }}>❤️</span>
            <span>u Srbiji</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { 
            opacity: 1; 
            transform: scale(1);
          }
          50% { 
            opacity: 0.6; 
            transform: scale(1.1);
          }
        }

        @keyframes heartbeat {
          0%, 100% { 
            transform: scale(1);
          }
          10%, 30% { 
            transform: scale(1.2);
          }
          20%, 40% { 
            transform: scale(1);
          }
        }

        input::placeholder {
          color: rgba(255,255,255,0.5);
        }
      `}</style>
    </footer>
    </>
  );
};

export default Footer;