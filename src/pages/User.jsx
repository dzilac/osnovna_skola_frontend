import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const User = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [childrenCount, setChildrenCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'Roditelj') {
      fetchChildrenCount();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchChildrenCount = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/parents/my-children', {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setChildrenCount(data.length);
      }
    } catch (error) {
      console.error('Greška pri učitavanju dece:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleName = (role) => {
    const roles = {
      'Roditelj': '👨‍👩‍👧‍👦 Roditelj',
      'Dete': '👶 Dete',
      'Domar': '🔧 Domar',
      'Admin': '👑 Administrator'
    };
    return roles[role] || role;
  };

  const getRoleColor = (role) => {
    const colors = {
      'Roditelj': { bg: '#e3f2fd', border: '#90caf9', text: '#1565c0' },
      'Dete': { bg: '#fff3e0', border: '#ffcc80', text: '#e65100' },
      'Domar': { bg: '#f3e5f5', border: '#ce93d8', text: '#6a1b9a' },
      'Admin': { bg: '#ffebee', border: '#ef9a9a', text: '#c62828' }
    };
    return colors[role] || { bg: '#f0f0f0', border: '#ccc', text: '#666' };
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return '??';
  };

  const roleColor = getRoleColor(user?.role);

  return (
    <div style={{ 
      minHeight: 'calc(100vh - 70px)',
      background: 'linear-gradient(135deg, #fff5f0 0%, #ffe8dc 100%)',
      padding: '30px 20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: window.innerWidth >= 992 ? '350px 1fr' : '1fr',
          gap: '24px'
        }}>
          {/* Leva kartica - Avatar i osnovni info */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '2px solid #f0f0f0',
            height: 'fit-content',
            position: 'sticky',
            top: '20px',
            textAlign: 'center'
          }}>
            {/* Avatar */}
            <div style={{ marginBottom: '24px' }}>
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={`${user.firstName} ${user.lastName}`}
                  style={{
                    width: '160px',
                    height: '160px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    border: '6px solid #f0f0f0',
                    margin: '0 auto 20px'
                  }}
                />
              ) : (
                <div style={{
                  width: '160px',
                  height: '160px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '64px',
                  boxShadow: '0 8px 24px rgba(102,126,234,0.4)',
                  border: '6px solid #f0f0f0',
                  margin: '0 auto 20px'
                }}>
                  {getInitials()}
                </div>
              )}

              <h2 style={{ 
                fontSize: '28px', 
                fontWeight: 'bold', 
                color: '#2c3e50',
                marginBottom: '8px',
                margin: 0
              }}>
                {user?.firstName} {user?.lastName}
              </h2>
              <p style={{ 
                fontSize: '15px', 
                color: '#5a6c7d',
                margin: 0,
                marginBottom: '16px'
              }}>
                {user?.email}
              </p>

              {/* Role badge */}
              <div style={{
                display: 'inline-block',
                padding: '10px 24px',
                borderRadius: '20px',
                backgroundColor: roleColor.bg,
                border: `2px solid ${roleColor.border}`,
                color: roleColor.text,
                fontWeight: '700',
                fontSize: '15px',
                marginBottom: '24px'
              }}>
                {getRoleName(user?.role)}
              </div>
            </div>

            {/* Statistika */}
            {user?.role === 'Roditelj' && (
              <div style={{
                background: 'linear-gradient(135deg, #fff5f0 0%, #ffe8dc 100%)',
                borderRadius: '14px',
                padding: '20px',
                marginBottom: '20px',
                border: '2px solid #ffe8dc'
              }}>
                <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>👨‍👩‍👧‍👦</span>
                <p style={{ fontSize: '13px', color: '#5a6c7d', margin: 0, marginBottom: '4px' }}>
                  Registrovane dece
                </p>
                {loading ? (
                  <div style={{
                    width: '40px',
                    height: '40px',
                    border: '3px solid #f0f0f0',
                    borderTop: '3px solid #ff9a56',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '8px auto'
                  }}></div>
                ) : (
                  <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#ff9a56', margin: 0 }}>
                    {childrenCount}
                  </p>
                )}
              </div>
            )}

            {user?.role === 'Dete' && user?.grade > 0 && (
              <div style={{
                background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                borderRadius: '14px',
                padding: '20px',
                marginBottom: '20px',
                border: '2px solid #90caf9'
              }}>
                <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>📚</span>
                <p style={{ fontSize: '13px', color: '#1565c0', margin: 0, marginBottom: '4px' }}>
                  Razred
                </p>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#0d47a1', margin: 0 }}>
                  {user.grade}.
                </p>
              </div>
            )}

            {/* Logout dugme */}
            <button
              onClick={() => setShowLogoutConfirm(true)}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #ef5350 0%, #e53935 100%)',
                color: 'white',
                padding: '14px 24px',
                borderRadius: '12px',
                border: 'none',
                fontWeight: '700',
                fontSize: '16px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(239,83,80,0.3)',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(239,83,80,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(239,83,80,0.3)';
              }}
            >
              <span style={{ fontSize: '20px' }}>🚪</span>
              <span>Odjavi se</span>
            </button>
          </div>

          {/* Desna strana - Detalji */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Lični podaci kartica */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              padding: '32px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '2px solid #f0f0f0'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '28px',
                paddingBottom: '20px',
                borderBottom: '2px solid #f0f0f0',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px'
                  }}>
                    👤
                  </div>
                  <div>
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c3e50', margin: 0 }}>
                      Lični podaci
                    </h3>
                  </div>
                </div>
                
                <button
                  onClick={() => navigate('/promeni-lozinku')}
                  style={{
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '10px',
                    border: 'none',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(240,147,251,0.3)',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(240,147,251,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(240,147,251,0.3)';
                  }}
                >
                  <span>🔒</span>
                  <span>Promeni lozinku</span>
                </button>
              </div>

              {/* Podaci */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    color: '#5a6c7d',
                    marginBottom: '8px'
                  }}>
                    Ime
                  </label>
                  <div style={{
                    padding: '14px 16px',
                    borderRadius: '12px',
                    backgroundColor: '#f8f9fa',
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#2c3e50',
                    border: '2px solid #e9ecef'
                  }}>
                    {user?.firstName}
                  </div>
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    color: '#5a6c7d',
                    marginBottom: '8px'
                  }}>
                    Prezime
                  </label>
                  <div style={{
                    padding: '14px 16px',
                    borderRadius: '12px',
                    backgroundColor: '#f8f9fa',
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#2c3e50',
                    border: '2px solid #e9ecef'
                  }}>
                    {user?.lastName}
                  </div>
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    color: '#5a6c7d',
                    marginBottom: '8px'
                  }}>
                    Email
                  </label>
                  <div style={{
                    padding: '14px 16px',
                    borderRadius: '12px',
                    backgroundColor: '#f8f9fa',
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#2c3e50',
                    border: '2px solid #e9ecef'
                  }}>
                    {user?.email}
                  </div>
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    color: '#5a6c7d',
                    marginBottom: '8px'
                  }}>
                    Uloga
                  </label>
                  <div style={{
                    padding: '14px 16px',
                    borderRadius: '12px',
                    backgroundColor: roleColor.bg,
                    fontSize: '16px',
                    fontWeight: '600',
                    color: roleColor.text,
                    border: `2px solid ${roleColor.border}`
                  }}>
                    {getRoleName(user?.role)}
                  </div>
                </div>

                {user?.role === 'Dete' && user?.grade > 0 && (
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      color: '#5a6c7d',
                      marginBottom: '8px'
                    }}>
                      Razred
                    </label>
                    <div style={{
                      padding: '14px 16px',
                      borderRadius: '12px',
                      backgroundColor: '#f8f9fa',
                      fontSize: '16px',
                      fontWeight: '500',
                      color: '#2c3e50',
                      border: '2px solid #e9ecef'
                    }}>
                      {user.grade}. razred
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '32px',
            maxWidth: '400px',
            width: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #ef5350 0%, #e53935 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '40px'
            }}>
              🚪
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '12px' }}>
              Odjava sa naloga
            </h3>
            <p style={{ color: '#5a6c7d', fontSize: '16px', marginBottom: '24px' }}>
              Da li ste sigurni da želite da se odjavite?
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                style={{
                  flex: 1,
                  padding: '14px 24px',
                  borderRadius: '12px',
                  border: '2px solid #e9ecef',
                  background: 'white',
                  color: '#5a6c7d',
                  fontWeight: '600',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                Otkaži
              </button>
              <button
                onClick={handleLogout}
                style={{
                  flex: 1,
                  padding: '14px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #ef5350 0%, #e53935 100%)',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '16px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(239,83,80,0.3)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(239,83,80,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(239,83,80,0.3)';
                }}
              >
                Odjavi se
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default User;