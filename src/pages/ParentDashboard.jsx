import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ParentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    if (user?.role === 'Roditelj') {
      fetchChildren();
    }
  }, [user]);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:5000/api/parents/my-children', {
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

  const fetchChildDetails = async (childId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/parents/child/${childId}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Greška pri učitavanju detalja');
      }

      const data = await response.json();
      setSelectedChild(data);
      setAiAnalysis(null);
    } catch (error) {
      console.error('Greška:', error);
      setError(error.message);
    }
  };

  const fetchAIAnalysis = async (childId) => {
    try {
      setLoadingAI(true);
      const response = await fetch(`http://localhost:5000/api/ai/analyze-child/${childId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Greška pri generisanju AI analize');
      }

      const data = await response.json();
      setAiAnalysis(data.analysis);
    } catch (error) {
      console.error('Greška:', error);
      setError(error.message);
    } finally {
      setLoadingAI(false);
    }
  };

  const calculatePercentage = (score, maxScore) => {
    if (!maxScore) return 0;
    return ((score / maxScore) * 100).toFixed(0);
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return { bg: '#d4edda', text: '#155724', border: '#c3e6cb' };
    if (percentage >= 75) return { bg: '#d1ecf1', text: '#0c5460', border: '#bee5eb' };
    if (percentage >= 60) return { bg: '#fff3cd', text: '#856404', border: '#ffeaa7' };
    return { bg: '#f8d7da', text: '#721c24', border: '#f5c6cb' };
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
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '30px' }}>
          <button 
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              color: '#5a6c7d',
              fontSize: '16px',
              cursor: 'pointer',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'color 0.2s'
            }}
          >
            ← Nazad na početnu
          </button>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '8px' }}>
                Dobrodošli, {user?.firstName}! 👋
              </h1>
              <p style={{ color: '#5a6c7d', fontSize: '16px' }}>Pratite napredak svoje dece</p>
            </div>
            
            <button
              onClick={() => navigate('/register-child')}
              style={{
                backgroundColor: '#ff9a56',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                fontWeight: '600',
                fontSize: '15px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(255,154,86,0.3)',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: '18px' }}>👤➕</span> Dodaj dete
            </button>
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            color: '#721c24',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '24px',
            fontWeight: '500'
          }}>
            ⚠️ {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: window.innerWidth >= 992 ? '350px 1fr' : '1fr',
            gap: '24px'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid #f0f0f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', gap: '12px' }}>
                <span style={{ fontSize: '28px' }}>👥</span>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#2c3e50', margin: 0 }}>
                  Vaša deca
                </h2>
                <span style={{
                  marginLeft: 'auto',
                  backgroundColor: '#fff5f0',
                  color: '#ff9a56',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  {children.length}
                </span>
              </div>
              
              {children.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{
                    backgroundColor: '#f8f9fa',
                    borderRadius: '50%',
                    width: '80px',
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px'
                  }}>
                    <span style={{ fontSize: '48px' }}>👥</span>
                  </div>
                  <p style={{ color: '#5a6c7d', fontWeight: '500', marginBottom: '8px' }}>
                    Nemate registrovane dece
                  </p>
                  <p style={{ color: '#95a5a6', fontSize: '14px' }}>
                    Kliknite na "Dodaj dete" da registrujete svoje dete
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {children.map((child) => (
                    <button
                      key={child._id}
                      onClick={() => fetchChildDetails(child._id)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '16px',
                        borderRadius: '14px',
                        border: selectedChild?._id === child._id ? '2px solid #ff9a56' : '2px solid transparent',
                        backgroundColor: selectedChild?._id === child._id ? '#fff5f0' : '#f8f9fa',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: selectedChild?._id === child._id ? '0 4px 12px rgba(255,154,86,0.2)' : 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedChild?._id !== child._id) {
                          e.currentTarget.style.backgroundColor = '#f0f0f0';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedChild?._id !== child._id) {
                          e.currentTarget.style.backgroundColor = '#f8f9fa';
                          e.currentTarget.style.boxShadow = 'none';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {child.profileImage ? (
                            <img
                              src={child.profileImage}
                              alt={`${child.firstName} ${child.lastName}`}
                              style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                boxShadow: '0 2px 8px rgba(255,154,86,0.3)',
                                border: '2px solid #ff9a56'
                              }}
                            />
                          ) : (
                            <div style={{
                              width: '48px',
                              height: '48px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #ff9a56 0%, #ff7f3f 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontWeight: 'bold',
                              fontSize: '18px',
                              boxShadow: '0 2px 8px rgba(255,154,86,0.3)'
                            }}>
                              {child.firstName?.[0]}{child.lastName?.[0]}
                            </div>
                          )}
                          <div>
                            <p style={{ 
                              fontWeight: '600', 
                              color: '#2c3e50',
                              margin: 0,
                              marginBottom: '4px'
                            }}>
                              {child.firstName} {child.lastName}
                            </p>
                            <p style={{ 
                              fontSize: '13px', 
                              color: '#5a6c7d',
                              margin: 0
                            }}>
                              📚 {child.grade}. razred
                            </p>
                          </div>
                        </div>
                        <span style={{ 
                          fontSize: '20px',
                          color: selectedChild?._id === child._id ? '#ff9a56' : '#95a5a6'
                        }}>
                          →
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              {!selectedChild ? (
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '20px',
                  padding: '80px 40px',
                  textAlign: 'center',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }}>
                  <span style={{ fontSize: '64px' }}>📖</span>
                  <h3 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '12px' }}>
                    Izaberite dete
                  </h3>
                  <p style={{ color: '#5a6c7d', fontSize: '16px' }}>
                    Kliknite na dete sa leve strane da vidite rezultate
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {selectedChild.completedQuizzes?.length > 0 && (
                    <div style={{
                      backgroundColor: 'white',
                      borderRadius: '20px',
                      padding: '28px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      border: '2px solid #e3f2fd'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '32px' }}>🤖</span>
                          <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c3e50', margin: 0 }}>
                            AI Analiza Napretka
                          </h3>
                        </div>
                        {!aiAnalysis && (
                          <button
                            onClick={() => fetchAIAnalysis(selectedChild._id)}
                            disabled={loadingAI}
                            style={{
                              backgroundColor: loadingAI ? '#95a5a6' : '#3498db',
                              color: 'white',
                              padding: '10px 20px',
                              borderRadius: '10px',
                              border: 'none',
                              fontWeight: '600',
                              cursor: loadingAI ? 'not-allowed' : 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                            {loadingAI ? '⏳ Generiše se...' : '✨ Generiši analizu'}
                          </button>
                        )}
                      </div>
                      
                      {loadingAI && (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                          <div style={{
                            width: '48px',
                            height: '48px',
                            border: '4px solid #f0f0f0',
                            borderTop: '4px solid #3498db',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto 16px'
                          }}></div>
                          <p style={{ color: '#5a6c7d' }}>Claude AI analizira rezultate...</p>
                        </div>
                      )}
                      
                      {aiAnalysis && (
                        <div style={{
                          backgroundColor: '#f8f9fa',
                          borderRadius: '14px',
                          padding: '24px',
                          whiteSpace: 'pre-wrap',
                          lineHeight: '1.8',
                          color: '#2c3e50',
                          fontSize: '15px'
                        }}>
                          {aiAnalysis}
                        </div>
                      )}
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth >= 768 ? 'repeat(3, 1fr)' : '1fr', gap: '16px' }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #fff9e6 100%)',
                      borderRadius: '16px',
                      padding: '24px',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
                    }}>
                      <span style={{ fontSize: '28px' }}>🏆</span>
                      <p style={{ color: '#5a6c7d', fontWeight: '500', margin: '8px 0' }}>Ukupno kvizova</p>
                      <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#2c3e50', margin: 0 }}>
                        {selectedChild.completedQuizzes?.length || 0}
                      </p>
                    </div>

                    <div style={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #e8f5e9 100%)',
                      borderRadius: '16px',
                      padding: '24px',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
                    }}>
                      <span style={{ fontSize: '28px' }}>📈</span>
                      <p style={{ color: '#5a6c7d', fontWeight: '500', margin: '8px 0' }}>Prosečan skor</p>
                      <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#2c3e50', margin: 0 }}>
                        {selectedChild.averageScore || '0.00'}
                      </p>
                    </div>

                    <div style={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #e3f2fd 100%)',
                      borderRadius: '16px',
                      padding: '24px',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
                    }}>
                      <span style={{ fontSize: '28px' }}>📚</span>
                      <p style={{ color: '#5a6c7d', fontWeight: '500', margin: '8px 0' }}>Razred</p>
                      <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#2c3e50', margin: 0 }}>
                        {selectedChild.grade}.
                      </p>
                    </div>
                  </div>

                  <div style={{
                    backgroundColor: 'white',
                    borderRadius: '20px',
                    padding: '28px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                  }}>
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '24px' }}>
                      Rezultati kvizova
                    </h3>
                    
                    {selectedChild.completedQuizzes?.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                        <span style={{ fontSize: '48px' }}>🏆</span>
                        <p style={{ color: '#5a6c7d', fontWeight: '500', marginTop: '16px' }}>
                          Još nema urađenih kvizova
                        </p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {selectedChild.completedQuizzes?.map((quiz, index) => {
                          const percentage = calculatePercentage(quiz.score, quiz.maxScore);
                          const colors = getGradeColor(percentage);
                          return (
                            <div key={index} style={{
                              padding: '20px',
                              background: 'linear-gradient(to right, #f8f9fa 0%, #ffffff 100%)',
                              borderRadius: '14px',
                              border: '1px solid #e9ecef',
                              transition: 'all 0.2s'
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '12px' }}>
                                <div style={{ flex: 1 }}>
                                  <h4 style={{ fontWeight: 'bold', color: '#2c3e50', fontSize: '18px', marginBottom: '8px' }}>
                                    {quiz.quizId?.title || 'Kviz'}
                                  </h4>
                                  <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#5a6c7d' }}>
                                    <span>📚 {quiz.quizId?.subject || 'Predmet'}</span>
                                    <span>🎯 {quiz.score}/{quiz.maxScore || '?'} bodova</span>
                                  </div>
                                </div>
                                <span style={{
                                  padding: '10px 20px',
                                  borderRadius: '12px',
                                  fontSize: '18px',
                                  fontWeight: 'bold',
                                  backgroundColor: colors.bg,
                                  color: colors.text,
                                  border: `2px solid ${colors.border}`
                                }}>
                                  {percentage}%
                                </span>
                              </div>
                              
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #e9ecef', gap: '16px', flexWrap: 'wrap' }}>
                                <span style={{ fontSize: '13px', color: '#5a6c7d' }}>
                                  📅 {new Date(quiz.completedAt).toLocaleDateString('sr-RS', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                                
                                <div style={{ flex: 1, maxWidth: '300px', minWidth: '200px' }}>
                                  <div style={{ backgroundColor: '#e9ecef', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
                                    <div style={{
                                      height: '100%',
                                      width: `${percentage}%`,
                                      backgroundColor: percentage >= 90 ? '#28a745' : percentage >= 75 ? '#17a2b8' : percentage >= 60 ? '#ffc107' : '#dc3545',
                                      transition: 'width 0.5s ease',
                                      borderRadius: '10px'
                                    }} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;