import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingUsers, setPendingUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [privateLessons, setPrivateLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('Sve');

  useEffect(() => {
    if (user?.role === 'Admin' || user?.role === 'Domar') {
      if (activeTab === 'pending') {
        fetchPendingUsers();
      } else if (activeTab === 'users') {
        fetchAllUsers();
      } else if (activeTab === 'activities') {
        fetchActivities();
      } else if (activeTab === 'lessons') {
        fetchPrivateLessons();
      }
    } else {
      navigate('/');
    }
  }, [user, navigate, activeTab]);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/pending-users`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Greška pri učitavanju');

      const data = await response.json();
      setPendingUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/all-users`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Greška pri učitavanju');

      const data = await response.json();
      setAllUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/activities`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Greška pri učitavanju');

      const data = await response.json();
      setActivities(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrivateLessons = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/private-lessons`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Greška pri učitavanju');

      const data = await response.json();
      setPrivateLessons(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (userId, approve) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/verify-user/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ approve, note: approve ? 'Odobreno' : 'Odbijeno' })
      });

      if (!response.ok) throw new Error('Greška pri verifikaciji');

      fetchPendingUsers();
    } catch (err) {
      alert('Greška: ' + err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Da li ste sigurni da želite da obrišete ovog korisnika?')) {
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/delete-user/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Greška pri brisanju');

      alert('Korisnik je uspešno obrisan');
      fetchAllUsers();
    } catch (err) {
      alert('Greška: ' + err.message);
    }
  };

  const handleDeleteActivity = async (activityId) => {
    if (!window.confirm('Da li ste sigurni da želite da obrišete ovu aktivnost?')) {
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/delete-activity/${activityId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Greška pri brisanju');

      alert('Aktivnost je uspešno obrisana');
      fetchActivities();
    } catch (err) {
      alert('Greška: ' + err.message);
    }
  };

  const handleDeletePrivateLesson = async (lessonId) => {
    if (!window.confirm('Da li ste sigurni da želite da obrišete ovaj privatni čas?')) {
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/delete-private-lesson/${lessonId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Greška pri brisanju');

      alert('Privatni čas je uspešno obrisan');
      fetchPrivateLessons();
    } catch (err) {
      alert('Greška: ' + err.message);
    }
  };

  const getRoleEmoji = (role) => {
    switch(role) {
      case 'Roditelj': return '👨‍👩‍👧';
      case 'Profesor': return '👨‍🏫';
      case 'Dete': return '👶';
      case 'Admin': return '👨‍💼';
      case 'Domar': return '🔧';
      default: return '👤';
    }
  };

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'Roditelj': return { bg: '#e3f2fd', text: '#1976d2' };
      case 'Profesor': return { bg: '#f3e5f5', text: '#7b1fa2' };
      case 'Dete': return { bg: '#fff3e0', text: '#f57c00' };
      case 'Admin': return { bg: '#e8f5e9', text: '#388e3c' };
      case 'Domar': return { bg: '#fce4ec', text: '#c2185b' };
      default: return { bg: '#f5f5f5', text: '#616161' };
    }
  };

  const filteredUsers = allUsers.filter(u => {
    const matchesSearch = u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'Sve' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (loading && (
    (activeTab === 'pending' && pendingUsers.length === 0) ||
    (activeTab === 'users' && allUsers.length === 0) ||
    (activeTab === 'activities' && activities.length === 0) ||
    (activeTab === 'lessons' && privateLessons.length === 0)
  )) {
    return (
      <div style={{
        minHeight: 'calc(100vh - 70px)',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            border: '4px solid #f0f0f0',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ color: '#5a6c7d' }}>Učitavanje...</p>
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
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '30px 20px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '32px' }}>👨‍💼</span>
              </div>
              <div>
                <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#2c3e50', margin: 0 }}>
                  Admin Panel
                </h1>
                <p style={{ color: '#5a6c7d', margin: 0 }}>Upravljanje korisnicima i sadržajem</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/add-user')}
                style={{
                  backgroundColor: '#3498db',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: 'none',
                  fontWeight: '600',
                  fontSize: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 8px rgba(52,152,219,0.3)'
                }}
              >
                <span style={{ fontSize: '18px' }}>👤➕</span> Dodaj Korisnika
              </button>
              
              <button
                onClick={() => navigate('/add-activity')}
                style={{
                  backgroundColor: '#9b59b6',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: 'none',
                  fontWeight: '600',
                  fontSize: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 8px rgba(155,89,182,0.3)'
                }}
              >
                <span style={{ fontSize: '18px' }}>🎨</span> Dodaj Aktivnost
              </button>
              
              <button
                onClick={() => navigate('/add-private-lesson')}
                style={{
                  backgroundColor: '#e67e22',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: 'none',
                  fontWeight: '600',
                  fontSize: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 8px rgba(230,126,34,0.3)'
                }}
              >
                <span style={{ fontSize: '18px' }}>📚</span> Dodaj Privatni Čas
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {[
            { id: 'pending', label: 'Na čekanju', icon: '⏳', count: pendingUsers.length },
            { id: 'users', label: 'Svi korisnici', icon: '👥', count: allUsers.length },
            { id: 'activities', label: 'Aktivnosti', icon: '🎨', count: activities.length },
            { id: 'lessons', label: 'Privatni časovi', icon: '📚', count: privateLessons.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 24px',
                borderRadius: '10px',
                border: activeTab === tab.id ? '2px solid #3498db' : '2px solid #e9ecef',
                backgroundColor: activeTab === tab.id ? '#e3f2fd' : 'white',
                color: activeTab === tab.id ? '#3498db' : '#5a6c7d',
                fontWeight: '600',
                fontSize: '15px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
              {tab.count !== undefined && (
                <span style={{
                  backgroundColor: activeTab === tab.id ? '#3498db' : '#e9ecef',
                  color: activeTab === tab.id ? 'white' : '#5a6c7d',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '13px'
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {error && (
          <div style={{
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            color: '#721c24',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '24px'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Content based on active tab */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '28px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          {/* Tab: Pending Users */}
          {activeTab === 'pending' && (
            <>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '24px' }}>
                Korisnici na čekanju
              </h2>
              
              {pendingUsers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <span style={{ fontSize: '64px' }}>✓</span>
                  <p style={{ color: '#5a6c7d', fontWeight: '500', marginTop: '16px' }}>
                    Nema korisnika koji čekaju verifikaciju
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {pendingUsers.map((pendingUser) => {
                    const roleColors = getRoleBadgeColor(pendingUser.role);
                    return (
                      <div key={pendingUser._id} style={{
                        padding: '20px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '12px',
                        border: '2px solid #e9ecef'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                              {pendingUser.profileImage ? (
                                <img src={pendingUser.profileImage} alt="" style={{
                                  width: '48px',
                                  height: '48px',
                                  borderRadius: '50%',
                                  objectFit: 'cover'
                                }} />
                              ) : (
                                <div style={{
                                  width: '48px',
                                  height: '48px',
                                  borderRadius: '50%',
                                  background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  fontWeight: 'bold',
                                  fontSize: '18px'
                                }}>
                                  {pendingUser.firstName?.[0]}{pendingUser.lastName?.[0]}
                                </div>
                              )}
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#2c3e50', margin: 0 }}>
                                    {pendingUser.firstName} {pendingUser.lastName}
                                  </h3>
                                  <span style={{
                                    backgroundColor: roleColors.bg,
                                    color: roleColors.text,
                                    padding: '4px 12px',
                                    borderRadius: '12px',
                                    fontSize: '13px',
                                    fontWeight: '600'
                                  }}>
                                    {getRoleEmoji(pendingUser.role)} {pendingUser.role}
                                  </span>
                                </div>
                                <p style={{ fontSize: '14px', color: '#5a6c7d', margin: 0 }}>
                                  📧 {pendingUser.email}
                                </p>
                              </div>
                            </div>

                            <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#5a6c7d', flexWrap: 'wrap' }}>
                              {pendingUser.grade > 0 && <span>📚 {pendingUser.grade}. razred</span>}
                              {pendingUser.parentId && (
                                <span>👨‍👩‍👧 Roditelj: {pendingUser.parentId.firstName} {pendingUser.parentId.lastName}</span>
                              )}
                              <span>📅 {new Date(pendingUser.createdAt).toLocaleDateString('sr-RS')}</span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                              onClick={() => handleVerify(pendingUser._id, true)}
                              style={{
                                backgroundColor: '#28a745',
                                color: 'white',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                border: 'none',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                            >
                              ✓ Odobri
                            </button>
                            <button
                              onClick={() => handleVerify(pendingUser._id, false)}
                              style={{
                                backgroundColor: '#dc3545',
                                color: 'white',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                border: 'none',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                            >
                              ✗ Odbij
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* Tab: All Users */}
          {activeTab === 'users' && (
            <>
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    placeholder="🔍 Pretraži po imenu ili email-u..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      flex: 1,
                      minWidth: '250px',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '2px solid #e9ecef',
                      fontSize: '15px',
                      outline: 'none'
                    }}
                  />
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      border: '2px solid #e9ecef',
                      fontSize: '15px',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="Sve">Sve uloge</option>
                    <option value="Roditelj">👨‍👩‍👧 Roditelj</option>
                    <option value="Profesor">👨‍🏫 Profesor</option>
                    <option value="Dete">👶 Dete</option>
                  </select>
                </div>
                <p style={{ color: '#5a6c7d', fontSize: '14px' }}>
                  Pronađeno: {filteredUsers.length} korisnika
                </p>
              </div>

              {filteredUsers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <span style={{ fontSize: '64px' }}>👥</span>
                  <p style={{ color: '#5a6c7d', fontWeight: '500', marginTop: '16px' }}>
                    Nema korisnika
                  </p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #e9ecef' }}>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#2c3e50' }}>Korisnik</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#2c3e50' }}>Email</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#2c3e50' }}>Uloga</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#2c3e50' }}>Razred</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#2c3e50' }}>Datum</th>
                        <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#2c3e50' }}>Akcije</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => {
                        const roleColors = getRoleBadgeColor(u.role);
                        return (
                          <tr key={u._id} style={{ borderBottom: '1px solid #e9ecef' }}>
                            <td style={{ padding: '12px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                {u.profileImage ? (
                                  <img src={u.profileImage} alt="" style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    objectFit: 'cover'
                                  }} />
                                ) : (
                                  <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '14px'
                                  }}>
                                    {u.firstName?.[0]}{u.lastName?.[0]}
                                  </div>
                                )}
                                <span style={{ fontWeight: '600', color: '#2c3e50' }}>
                                  {u.firstName} {u.lastName}
                                </span>
                              </div>
                            </td>
                            <td style={{ padding: '12px', color: '#5a6c7d' }}>{u.email}</td>
                            <td style={{ padding: '12px' }}>
                              <span style={{
                                backgroundColor: roleColors.bg,
                                color: roleColors.text,
                                padding: '4px 12px',
                                borderRadius: '12px',
                                fontSize: '13px',
                                fontWeight: '600',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}>
                                {getRoleEmoji(u.role)} {u.role}
                              </span>
                            </td>
                            <td style={{ padding: '12px', color: '#5a6c7d' }}>
                              {u.grade > 0 ? `${u.grade}. razred` : '-'}
                            </td>
                            <td style={{ padding: '12px', color: '#5a6c7d' }}>
                              {new Date(u.createdAt).toLocaleDateString('sr-RS')}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'center' }}>
                              <button
                                onClick={() => handleDeleteUser(u._id)}
                                style={{
                                  backgroundColor: '#dc3545',
                                  color: 'white',
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  border: 'none',
                                  fontWeight: '600',
                                  fontSize: '13px',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s'
                                }}
                              >
                                🗑️ Obriši
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* Tab: Activities */}
          {activeTab === 'activities' && (
            <>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '24px' }}>
                Sve Aktivnosti
              </h2>
              
              {activities.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <span style={{ fontSize: '64px' }}>🎨</span>
                  <p style={{ color: '#5a6c7d', fontWeight: '500', marginTop: '16px' }}>
                    Nema aktivnosti
                  </p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                  {activities.map((activity) => (
                    <div key={activity._id} style={{
                      border: '2px solid #e9ecef',
                      borderRadius: '12px',
                      padding: '0',
                      backgroundColor: 'white',
                      overflow: 'hidden',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      transition: 'all 0.3s'
                    }}>
                      {/* Image Header */}
                      {activity.image && (
                        <img src={activity.image} alt={activity.title} style={{
                          width: '100%',
                          height: '180px',
                          objectFit: 'cover'
                        }} />
                      )}
                      
                      {/* Content */}
                      <div style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#2c3e50', margin: 0, flex: 1 }}>
                            {activity.title}
                          </h3>
                          <span style={{
                            backgroundColor: '#e3f2fd',
                            color: '#1976d2',
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600',
                            whiteSpace: 'nowrap',
                            marginLeft: '8px'
                          }}>
                            {activity.category}
                          </span>
                        </div>
                        
                        <p style={{ fontSize: '14px', color: '#5a6c7d', marginBottom: '16px', lineHeight: '1.5' }}>
                          {activity.description}
                        </p>
                        
                        {/* Info Grid */}
                        <div style={{ fontSize: '13px', color: '#5a6c7d', marginBottom: '16px', display: 'grid', gap: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>👨‍🏫</span>
                            <span><strong>Predavač:</strong> {activity.instructor}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>📅</span>
                            <span><strong>{activity.schedule.day}</strong> - {activity.schedule.time}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>📍</span>
                            <span>{activity.location}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>👥</span>
                            <span><strong>{activity.enrolled?.length || 0}/{activity.capacity}</strong> prijavljeno</span>
                          </div>
                          {activity.price > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span>💰</span>
                              <span><strong>{activity.price} RSD</strong></span>
                            </div>
                          )}
                        </div>

                        {/* Enrolled Children Section */}
                        {activity.enrolled && activity.enrolled.length > 0 && (
                          <div style={{
                            backgroundColor: '#f8f9fa',
                            padding: '12px',
                            borderRadius: '8px',
                            marginBottom: '12px',
                            border: '1px solid #e9ecef'
                          }}>
                            <div style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              marginBottom: '8px'
                            }}>
                              <span style={{ fontSize: '13px', fontWeight: '600', color: '#2c3e50' }}>
                                👶 Prijavljena deca ({activity.enrolled.length})
                              </span>
                            </div>
                            <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
                              {activity.enrolled.map((child, idx) => (
                                <div key={idx} style={{
                                  fontSize: '12px',
                                  color: '#5a6c7d',
                                  padding: '6px 8px',
                                  backgroundColor: 'white',
                                  borderRadius: '6px',
                                  marginBottom: '4px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px'
                                }}>
                                  <div style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    backgroundColor: '#e3f2fd',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '10px',
                                    fontWeight: 'bold',
                                    color: '#1976d2'
                                  }}>
                                    {child.firstName?.[0]}{child.lastName?.[0]}
                                  </div>
                                  <span>
                                    <strong>{child.firstName} {child.lastName}</strong>
                                    {child.grade && <span style={{ color: '#9ca3af' }}> • {child.grade}. razred</span>}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteActivity(activity._id)}
                          style={{
                            width: '100%',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            padding: '10px',
                            borderRadius: '8px',
                            border: 'none',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontSize: '14px'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c82333'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc3545'}
                        >
                          🗑️ Obriši Aktivnost
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Tab: Private Lessons */}
          {activeTab === 'lessons' && (
            <>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '24px' }}>
                Svi Privatni Časovi
              </h2>
              
              {privateLessons.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <span style={{ fontSize: '64px' }}>📚</span>
                  <p style={{ color: '#5a6c7d', fontWeight: '500', marginTop: '16px' }}>
                    Nema privatnih časova
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {privateLessons.map((lesson) => (
                    <div key={lesson._id} style={{
                      border: '2px solid #e9ecef',
                      borderRadius: '12px',
                      padding: '20px',
                      backgroundColor: '#f8f9fa'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '8px' }}>
                            {lesson.subject}
                          </h3>
                          <p style={{ fontSize: '14px', color: '#5a6c7d', marginBottom: '12px' }}>
                            {lesson.description}
                          </p>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', fontSize: '13px', color: '#5a6c7d' }}>
                            <div>👨‍🏫 Profesor: {lesson.professor?.firstName} {lesson.professor?.lastName}</div>
                            <div>📚 Razredi: {lesson.grades?.join(', ')}</div>
                            <div>📅 {lesson.schedule}</div>
                            <div>📍 {lesson.location}</div>
                            <div>💰 {lesson.price} RSD</div>
                            <div>⏱️ {lesson.duration} minuta</div>
                            <div>📞 {lesson.contactPhone}</div>
                            <div>📧 {lesson.contactEmail}</div>
                            {lesson.isVerified && <div>✅ Verifikovan</div>}
                          </div>
                        </div>
                        <div>
                          <button
                            onClick={() => handleDeletePrivateLesson(lesson._id)}
                            style={{
                              backgroundColor: '#dc3545',
                              color: 'white',
                              padding: '10px 20px',
                              borderRadius: '8px',
                              border: 'none',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                            🗑️ Obriši
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;