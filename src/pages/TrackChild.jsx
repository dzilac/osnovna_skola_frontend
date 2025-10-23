import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const TrackChild = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [childLocation, setChildLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (user?.role === 'Roditelj') {
      fetchChildren();
    }
  }, [user]);

  useEffect(() => {
    let intervalId;
    if (selectedChild) {
      fetchChildLocation(selectedChild._id);
      intervalId = setInterval(() => {
        fetchChildLocation(selectedChild._id);
      }, 10000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [selectedChild]);

  useEffect(() => {
    if (childLocation && mapRef.current && window.L) {
      initializeMap();
    }
  }, [childLocation]);

  const initializeMap = () => {
    if (!window.L) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    const map = window.L.map(mapRef.current).setView(
      [childLocation.latitude, childLocation.longitude], 
      15
    );

    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    const customIcon = window.L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          position: relative;
          width: 40px;
          height: 40px;
        ">
          <div style="
            position: absolute;
            top: 0;
            left: 0;
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #ff9a56 0%, #ff7f3f 100%);
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 4px 12px rgba(255,154,86,0.5);
            border: 3px solid white;
          "></div>
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 18px;
            z-index: 1;
          ">📍</div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    });

    const marker = window.L.marker(
      [childLocation.latitude, childLocation.longitude],
      { icon: customIcon }
    ).addTo(map);

    const popupContent = `
      <div style="text-align: center; padding: 8px;">
        <strong style="font-size: 16px; color: #2c3e50;">
          ${selectedChild.firstName} ${selectedChild.lastName}
        </strong>
        <p style="margin: 8px 0 0 0; color: #5a6c7d; font-size: 13px;">
          ${childLocation.address || 'Trenutna lokacija'}
        </p>
      </div>
    `;
    marker.bindPopup(popupContent).openPopup();

    window.L.circle(
      [childLocation.latitude, childLocation.longitude],
      {
        color: '#ff9a56',
        fillColor: '#ff9a56',
        fillOpacity: 0.1,
        radius: 100
      }
    ).addTo(map);

    mapInstanceRef.current = map;
    markerRef.current = marker;
  };

  const fetchChildren = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${process.env.REACT_APP_API_URL}/parents/my-children`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Greška pri učitavanju dece');
      }

      const data = await response.json();
      setChildren(data);
    } catch (error) {
      console.error('Greška:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchChildLocation = async (childId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/location/child/${childId}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Greška pri učitavanju lokacije');
      }

      const data = await response.json();
      setChildLocation(data);
      setLastUpdate(new Date());
      
      if (mapInstanceRef.current && markerRef.current && window.L) {
        const newLatLng = window.L.latLng(data.latitude, data.longitude);
        markerRef.current.setLatLng(newLatLng);
        mapInstanceRef.current.panTo(newLatLng);
      }
    } catch (error) {
      console.error('Greška:', error);
      setChildLocation(null);
      
    }
  };

  const openInGoogleMaps = () => {
    if (childLocation?.latitude && childLocation?.longitude) {
      window.open(`https://www.google.com/maps?q=${childLocation.latitude},${childLocation.longitude}`, '_blank');
    }
  };

  const openInOpenStreetMap = () => {
    if (childLocation?.latitude && childLocation?.longitude) {
      window.open(`https://www.openstreetmap.org/?mlat=${childLocation.latitude}&mlon=${childLocation.longitude}&zoom=15`, '_blank');
    }
  };

  const getTimeSinceUpdate = () => {
    if (!lastUpdate) return 'Nikada';
    const now = new Date();
    const diffMs = now - lastUpdate;
    const diffSec = Math.floor(diffMs / 1000);
    
    if (diffSec < 60) return `Pre ${diffSec} sekundi`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `Pre ${diffMin} minuta`;
    const diffHour = Math.floor(diffMin / 60);
    return `Pre ${diffHour} sati`;
  };

  if (loading && !selectedChild) {
    return (
      <div style={{ 
        minHeight: 'calc(100vh - 70px)', 
        background: 'linear-gradient(135deg, #fff5f0 0%, #ffe8dc 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            border: '4px solid #f0f0f0',
            borderTop: '4px solid #ff9a56',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ color: '#5a6c7d', fontWeight: '500' }}>Učitavanje...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: 'calc(100vh - 70px)',
      background: 'linear-gradient(135deg, #fff5f0 0%, #ffe8dc 100%)',
      padding: '30px 20px'
    }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          
          
          <div style={{ 
            background: 'linear-gradient(135deg, #ffffff 0%, #fff9f0 100%)',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '2px solid #ffe8dc'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #ff9a56 0%, #ff7f3f 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px',
                boxShadow: '0 8px 24px rgba(255,154,86,0.4)'
              }}>
                📍
              </div>
              <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '8px', margin: 0 }}>
                  GPS Praćenje
                </h1>
                <p style={{ color: '#5a6c7d', fontSize: '16px', margin: 0 }}>
                  Pratite lokaciju svoje dece u realnom vremenu
                </p>
              </div>
              <div style={{
                padding: '16px 24px',
                background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                borderRadius: '12px',
                border: '2px solid #90caf9'
              }}>
                <p style={{ fontSize: '13px', color: '#1976d2', margin: 0, marginBottom: '4px', fontWeight: '600' }}>
                  Auto-refresh
                </p>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#0d47a1', margin: 0 }}>
                  10s
                </p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#ffebee',
            border: '2px solid #ef5350',
            color: '#c62828',
            padding: '16px 20px',
            borderRadius: '12px',
            marginBottom: '24px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '24px' }}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: selectedChild ? (window.innerWidth >= 1200 ? '400px 1fr' : '1fr') : '1fr',
          gap: '24px'
        }}>
          {/* Lista dece */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '2px solid #f0f0f0',
            height: 'fit-content',
            position: 'sticky',
            top: '20px'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: '20px',
              paddingBottom: '16px',
              borderBottom: '2px solid #f0f0f0'
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
                  👥
                </div>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#2c3e50', margin: 0 }}>
                    Vaša deca
                  </h2>
                  <p style={{ fontSize: '13px', color: '#5a6c7d', margin: 0 }}>
                    Izaberite dete za praćenje
                  </p>
                </div>
              </div>
              <div style={{
                backgroundColor: '#f0f0f0',
                color: '#2c3e50',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '16px',
                fontWeight: 'bold'
              }}>
                {children.length}
              </div>
            </div>
            
            {children.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{
                  backgroundColor: '#f8f9fa',
                  borderRadius: '50%',
                  width: '100px',
                  height: '100px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}>
                  <span style={{ fontSize: '56px' }}>👥</span>
                </div>
                <p style={{ color: '#5a6c7d', fontWeight: '600', marginBottom: '8px', fontSize: '16px' }}>
                  Nemate registrovane dece
                </p>
                <p style={{ color: '#95a5a6', fontSize: '14px' }}>
                  Dodajte decu u sistem
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {children.map((child) => (
                  <button
                    key={child._id}
                    onClick={() => {
                      setSelectedChild(child);
                      setChildLocation(null);
                      setError(null);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '16px',
                      borderRadius: '16px',
                      border: selectedChild?._id === child._id ? '3px solid #ff9a56' : '2px solid #f0f0f0',
                      backgroundColor: selectedChild?._id === child._id ? '#fff5f0' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      boxShadow: selectedChild?._id === child._id ? '0 8px 20px rgba(255,154,86,0.25)' : '0 2px 8px rgba(0,0,0,0.05)',
                      transform: selectedChild?._id === child._id ? 'scale(1.02)' : 'scale(1)'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedChild?._id !== child._id) {
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedChild?._id !== child._id) {
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      {child.profileImage ? (
                        <img
                          src={child.profileImage}
                          alt={`${child.firstName} ${child.lastName}`}
                          style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '14px',
                            objectFit: 'cover',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            border: '3px solid white'
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '14px',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '20px',
                          boxShadow: '0 4px 12px rgba(102,126,234,0.4)',
                          border: '3px solid white'
                        }}>
                          {child.firstName?.[0]}{child.lastName?.[0]}
                        </div>
                      )}
                      <div style={{ flex: 1 }}>
                        <p style={{ 
                          fontWeight: '700', 
                          color: '#2c3e50',
                          margin: 0,
                          marginBottom: '6px',
                          fontSize: '16px'
                        }}>
                          {child.firstName} {child.lastName}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '18px' }}>📚</span>
                          <span style={{ 
                            fontSize: '13px', 
                            color: '#5a6c7d',
                            fontWeight: '500'
                          }}>
                            {child.grade}. razred
                          </span>
                        </div>
                      </div>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: selectedChild?._id === child._id 
                          ? 'linear-gradient(135deg, #ff9a56 0%, #ff7f3f 100%)' 
                          : '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        transition: 'all 0.3s'
                      }}>
                        {selectedChild?._id === child._id ? '📍' : '→'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              )}
          </div>

          {/* Mapa i detalji */}
          {selectedChild && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Status kartica */}
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '20px',
                padding: '28px',
                boxShadow: '0 8px 24px rgba(102,126,234,0.3)',
                color: 'white'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    {selectedChild.profileImage ? (
                      <img
                        src={selectedChild.profileImage}
                        alt={`${selectedChild.firstName} ${selectedChild.lastName}`}
                        style={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '16px',
                          objectFit: 'cover',
                          boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                          border: '4px solid rgba(255,255,255,0.3)'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '16px',
                        background: 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(10px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '32px',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                        border: '4px solid rgba(255,255,255,0.3)'
                      }}>
                        {selectedChild.firstName?.[0]}{selectedChild.lastName?.[0]}
                      </div>
                    )}
                    <div>
                      <h2 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0, marginBottom: '8px' }}>
                        {selectedChild.firstName} {selectedChild.lastName}
                      </h2>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '15px', opacity: 0.9 }}>
                        <span>📚 {selectedChild.grade}. razred</span>
                        {lastUpdate && (
                          <>
                            <span>•</span>
                            <span>🕐 {getTimeSinceUpdate()}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 24px',
                    borderRadius: '16px',
                    backgroundColor: childLocation ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255,255,255,0.3)'
                  }}>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: childLocation ? '#4caf50' : '#f44336',
                      animation: childLocation ? 'pulse 2s infinite' : 'none',
                      boxShadow: childLocation ? '0 0 20px rgba(76, 175, 80, 0.8)' : '0 0 20px rgba(244, 67, 54, 0.8)'
                    }}></div>
                    <span style={{ 
                      fontSize: '16px', 
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>
                      {childLocation ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mapa kartica */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '20px',
                padding: '28px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '2px solid #f0f0f0'
              }}>
                {!childLocation ? (
                  <div style={{
                    backgroundColor: '#f8f9fa',
                    borderRadius: '16px',
                    padding: '80px 40px',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      margin: '0 auto 24px',
                      background: 'linear-gradient(135deg, #ff9a56 0%, #ff7f3f 100%)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      animation: 'pulse 2s infinite'
                    }}>
                      <span style={{ fontSize: '40px' }}>📡</span>
                    </div>
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '12px' }}>
                      Povezivanje...
                    </h3>
                    <p style={{ color: '#5a6c7d', fontSize: '16px', marginBottom: '20px' }}>
                      Tražimo lokaciju deteta
                    </p>
                    <div style={{
                      width: '200px',
                      height: '4px',
                      backgroundColor: '#e9ecef',
                      borderRadius: '10px',
                      margin: '0 auto',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: '50%',
                        height: '100%',
                        background: 'linear-gradient(90deg, #ff9a56, #ff7f3f)',
                        borderRadius: '10px',
                        animation: 'loading 1.5s ease-in-out infinite'
                      }}></div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div 
                      ref={mapRef}
                      style={{
                        width: '100%',
                        height: '500px',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        marginBottom: '24px',
                        border: '3px solid #e9ecef',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                      }}
                    ></div>

                    {/* Koordinate */}
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: window.innerWidth >= 768 ? 'repeat(3, 1fr)' : '1fr', 
                      gap: '16px', 
                      marginBottom: '20px' 
                    }}>
                      <div style={{
                        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                        borderRadius: '14px',
                        padding: '20px',
                        border: '2px solid #90caf9'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                          <span style={{ fontSize: '24px' }}>🌐</span>
                          <p style={{ fontSize: '13px', color: '#1565c0', margin: 0, fontWeight: '600' }}>
                            Geografska širina
                          </p>
                        </div>
                        <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#0d47a1', margin: 0 }}>
                          {childLocation.latitude.toFixed(6)}°
                        </p>
                      </div>

                      <div style={{
                        background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
                        borderRadius: '14px',
                        padding: '20px',
                        border: '2px solid #ce93d8'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                          <span style={{ fontSize: '24px' }}>🗺️</span>
                          <p style={{ fontSize: '13px', color: '#6a1b9a', margin: 0, fontWeight: '600' }}>
                            Geografska dužina
                          </p>
                        </div>
                        <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#4a148c', margin: 0 }}>
                          {childLocation.longitude.toFixed(6)}°
                        </p>
                      </div>

                      <div style={{
                        background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                        borderRadius: '14px',
                        padding: '20px',
                        border: '2px solid #ffcc80'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                          <span style={{ fontSize: '24px' }}>⏱️</span>
                          <p style={{ fontSize: '13px', color: '#e65100', margin: 0, fontWeight: '600' }}>
                            Ažurirano
                          </p>
                        </div>
                        <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#bf360c', margin: 0 }}>
                          {getTimeSinceUpdate()}
                        </p>
                      </div>
                    </div>

                    {/* Adresa */}
                    {childLocation.address && (
                      <div style={{
                        background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
                        borderRadius: '14px',
                        padding: '20px',
                        marginBottom: '20px',
                        border: '2px solid #81c784'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                          <span style={{ fontSize: '24px' }}>📮</span>
                          <p style={{ fontSize: '13px', color: '#2e7d32', margin: 0, fontWeight: '600' }}>
                            Trenutna adresa
                          </p>
                        </div>
                        <p style={{ fontSize: '18px', fontWeight: '600', color: '#1b5e20', margin: 0 }}>
                          {childLocation.address}
                        </p>
                      </div>
                    )}

                    {/* Akcioni dugmići */}
                    {/* Akcioni dugme - Centrirano */}
<div style={{
  display: 'flex',
  justifyContent: 'center'
}}>
  <button
    onClick={openInGoogleMaps}
    style={{
      background: 'linear-gradient(135deg, #4285f4 0%, #1a73e8 100%)',
      color: 'white',
      padding: '18px 40px',
      borderRadius: '14px',
      border: 'none',
      fontWeight: '700',
      fontSize: '16px',
      cursor: 'pointer',
      boxShadow: '0 6px 20px rgba(66,133,244,0.4)',
      transition: 'all 0.3s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      minWidth: '300px'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-3px)';
      e.currentTarget.style.boxShadow = '0 8px 24px rgba(66,133,244,0.5)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 6px 20px rgba(66,133,244,0.4)';
    }}
  >
    <span style={{ fontSize: '22px' }}>🗺️</span>
    <span>Otvori u Google Maps</span>
  </button>
</div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { 
            opacity: 1; 
            transform: scale(1); 
          }
          50% { 
            opacity: 0.7; 
            transform: scale(1.05); 
          }
        }
        
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(400%);
          }
        }
        
        .leaflet-container {
          font-family: inherit;
          z-index: 1;
        }
        
        .custom-marker {
          background: transparent;
          border: none;
        }
        
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }
        
        .leaflet-popup-tip {
          background: white;
        }
      `}</style>
    </div>
  );
};

export default TrackChild;