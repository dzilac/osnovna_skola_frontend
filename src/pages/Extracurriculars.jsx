import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Clock, DollarSign, User, Filter, Search } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Extracurriculars = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Sve');
  const [searchTerm, setSearchTerm] = useState('');
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState('');
  const [error, setError] = useState('');

  const categories = ['Sve', 'Umetnost', 'Sport', 'Nauka', 'Muzika', 'Tehnologija', 'Jezik', 'Ostalo'];

  const getToken = () => {
    let token = localStorage.getItem('token');
    if (!token) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          token = user.token;
        } catch (e) {
          console.error('Error parsing user from localStorage', e);
        }
      }
    }
    return token;
  };

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic'
    });
    fetchActivities();
    fetchChildren();
  }, []);

  const fetchActivities = async () => {
    try {
      let token = localStorage.getItem('token');
      
      if (!token) {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            token = user.token;
          } catch (e) {
            console.error('Error parsing user from localStorage', e);
          }
        }
      }
      
      if (!token) {
        setError('Molimo prijavite se da biste videli aktivnosti');
        setLoading(false);
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/activities`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Sesija je istekla. Molimo prijavite se ponovo.');
        } else {
          setError('Greška pri učitavanju aktivnosti');
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      setActivities(Array.isArray(data) ? data.filter(activity => activity.isActive) : []);
      setError('');
      setLoading(false);
    } catch (error) {
      console.error('Greška pri učitavanju aktivnosti:', error);
      setError('Greška pri komunikaciji sa serverom');
      setActivities([]);
      setLoading(false);
    }
  };

  const fetchChildren = async () => {
    try {
      let token = localStorage.getItem('token');
      
      if (!token) {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            token = user.token;
          } catch (e) {
            console.error('Error parsing user from localStorage', e);
          }
        }
      }
      
      if (!token) {
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/children`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.log('Nema dostupne dece ili niste roditelj');
        setChildren([]);
        return;
      }

      const data = await response.json();
      setChildren(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Greška pri učitavanju dece:', error);
      setChildren([]);
    }
  };

  const handleEnroll = async (activityId) => {
    if (!selectedChild) {
      alert('Molimo izaberite dete pre prijave');
      return;
    }

    try {
      let token = localStorage.getItem('token');
      
      if (!token) {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            token = user.token;
          } catch (e) {
            console.error('Error parsing user from localStorage', e);
          }
        }
      }
      
      if (!token) {
        alert('Niste ulogovani. Molimo prijavite se ponovo.');
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/activities/${activityId}/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ childId: selectedChild })
      });

      const result = await response.json();

      if (response.ok) {
        alert('Uspešno ste prijavili dete na aktivnost!');
        fetchActivities();
      } else {
        alert(result.message || 'Greška pri prijavi');
      }
    } catch (error) {
      console.error('Greška:', error);
      alert('Došlo je do greške pri prijavi: ' + error.message);
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesCategory = selectedCategory === 'Sve' || activity.category === selectedCategory;
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          activity.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category) => {
    const colors = {
      'Umetnost': '#d946ef',
      'Sport': '#10b981',
      'Nauka': '#3b82f6',
      'Muzika': '#ec4899',
      'Tehnologija': '#8b5cf6',
      'Jezik': '#f59e0b',
      'Ostalo': '#6b7280'
    };
    return colors[category] || '#6b7280';
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fff5f0 0%, #ffe8dc 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '80px'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          border: '6px solid #fed7aa',
          borderTop: '6px solid #ff9a56',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '24px'
        }}></div>
        <p style={{ color: '#9a3412', fontSize: '20px', fontWeight: '600' }}>
          Učitavanje aktivnosti...
        </p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fff5f0 0%, #ffe8dc 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        paddingTop: '100px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '50px',
          borderRadius: '25px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          textAlign: 'center',
          maxWidth: '500px',
          border: '2px solid #fed7aa'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>⚠️</div>
          <h2 style={{ color: '#e74c3c', fontSize: '24px', marginBottom: '20px', fontWeight: '700' }}>
            {error}
          </h2>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              padding: '14px 32px',
              background: 'linear-gradient(135deg, #ff9a56 0%, #ff7f3f 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(255,154,86,0.4)',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(255,154,86,0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(255,154,86,0.4)';
            }}
          >
            Pokušaj ponovo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fff5f0 0%, #ffe8dc 100%)',
      paddingTop: '100px',
      paddingBottom: '60px'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }} data-aos="fade-down">
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #ff9a56 0%, #ff7f3f 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '15px',
            textShadow: '0 2px 10px rgba(255,154,86,0.2)'
          }}>
            ⚽ Vannastavne aktivnosti
          </h1>
          <p style={{
            fontSize: '20px',
            color: '#9a3412',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Pronađite savršenu aktivnost za razvoj talenata vašeg deteta
          </p>
        </div>

        {/* Child Selection */}
        {children.length > 0 && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(255,154,86,0.15)',
            padding: '30px',
            marginBottom: '30px',
            border: '2px solid #fed7aa'
          }} data-aos="fade-up">
            <label style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '16px',
              fontWeight: '700',
              color: '#9a3412',
              marginBottom: '15px'
            }}>
              <User style={{ width: '20px', height: '20px', marginRight: '10px', color: '#ff9a56' }} />
              Izaberite dete za prijavu na aktivnost:
            </label>
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 18px',
                border: '2px solid #fed7aa',
                borderRadius: '12px',
                fontSize: '16px',
                outline: 'none',
                transition: 'all 0.3s',
                color: '#9a3412',
                fontWeight: '500',
                cursor: 'pointer'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#ff9a56';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,154,86,0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#fed7aa';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <option value="">-- Izaberite dete --</option>
              {children.map(child => (
                <option key={child._id} value={child._id}>
                  {child.firstName} {child.lastName} ({child.grade}. razred)
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Filters */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(255,154,86,0.15)',
          padding: '30px',
          marginBottom: '40px',
          border: '2px solid #fed7aa'
        }} data-aos="fade-up" data-aos-delay="100">
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth >= 768 ? '1fr 1fr' : '1fr',
            gap: '30px'
          }}>
            {/* Search */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '15px',
                fontWeight: '700',
                color: '#9a3412',
                marginBottom: '12px'
              }}>
                <Search style={{ width: '18px', height: '18px', marginRight: '8px', color: '#ff9a56' }} />
                Pretraga
              </label>
              <input
                type="text"
                placeholder="Pretražite po nazivu, opisu ili predavaču..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  border: '2px solid #fed7aa',
                  borderRadius: '12px',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.3s',
                  color: '#9a3412'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#ff9a56';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,154,86,0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#fed7aa';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Categories */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '15px',
                fontWeight: '700',
                color: '#9a3412',
                marginBottom: '12px'
              }}>
                <Filter style={{ width: '18px', height: '18px', marginRight: '8px', color: '#ff9a56' }} />
                Kategorija
              </label>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '50px',
                      fontWeight: '600',
                      fontSize: '14px',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: selectedCategory === category 
                        ? '#ff9a56' 
                        : '#ffedd5',
                      color: selectedCategory === category 
                        ? 'white' 
                        : '#9a3412',
                      transition: 'all 0.3s',
                      boxShadow: selectedCategory === category 
                        ? '0 4px 15px rgba(255,154,86,0.4)' 
                        : 'none',
                      transform: selectedCategory === category 
                        ? 'scale(1.05)' 
                        : 'scale(1)'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedCategory !== category) {
                        e.currentTarget.style.backgroundColor = '#fed7aa';
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedCategory !== category) {
                        e.currentTarget.style.backgroundColor = '#ffedd5';
                        e.currentTarget.style.transform = 'scale(1)';
                      }
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Activities Grid */}
        {filteredActivities.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '25px',
            boxShadow: '0 10px 30px rgba(255,154,86,0.15)',
            padding: '80px 40px',
            textAlign: 'center',
            border: '2px solid #fed7aa'
          }} data-aos="zoom-in">
            <div style={{ 
              fontSize: '100px', 
              marginBottom: '30px',
              animation: 'float 3s ease-in-out infinite'
            }}>
              🎨
            </div>
            <h3 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#9a3412',
              marginBottom: '15px'
            }}>
              Nema dostupnih aktivnosti
            </h3>
            <p style={{
              color: '#c2410c',
              fontSize: '16px',
              maxWidth: '400px',
              margin: '0 auto'
            }}>
              Pokušajte sa drugom pretragom ili kategorijom
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth >= 1024 ? 'repeat(3, 1fr)' : window.innerWidth >= 768 ? 'repeat(2, 1fr)' : '1fr',
            gap: '25px'
          }}>
            {filteredActivities.map((activity, index) => {
              const isEnrolled = selectedChild && activity.enrolled && activity.enrolled.includes(selectedChild);
              const isFull = activity.enrolled && activity.enrolled.length >= activity.capacity;
              const availableSpots = activity.capacity - (activity.enrolled ? activity.enrolled.length : 0);

              return (
                <div
                  key={activity._id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '20px',
                    boxShadow: '0 10px 30px rgba(255,154,86,0.15)',
                    overflow: 'hidden',
                    transition: 'all 0.3s',
                    cursor: 'pointer',
                    border: '2px solid #fed7aa'
                  }}
                  data-aos="fade-up"
                  data-aos-delay={index * 50}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 15px 40px rgba(255,154,86,0.25)';
                    e.currentTarget.style.borderColor = '#ff9a56';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(255,154,86,0.15)';
                    e.currentTarget.style.borderColor = '#fed7aa';
                  }}
                >
                  {/* Image */}
                  <div style={{
                    height: '200px',
                    background: `linear-gradient(135deg, ${getCategoryColor(activity.category)}dd 0%, ${getCategoryColor(activity.category)} 100%)`,
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {activity.image ? (
                      <img
                        src={activity.image}
                        alt={activity.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                      }}>
                        <Users style={{ width: '80px', height: '80px', opacity: 0.5 }} />
                      </div>
                    )}
                    <span style={{
                      position: 'absolute',
                      top: '15px',
                      right: '15px',
                      padding: '8px 16px',
                      borderRadius: '50px',
                      fontSize: '13px',
                      fontWeight: '700',
                      color: 'white',
                      backgroundColor: getCategoryColor(activity.category),
                      boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                    }}>
                      {activity.category}
                    </span>
                  </div>

                  {/* Content */}
                  <div style={{ padding: '25px' }}>
                    <h3 style={{
                      fontSize: '22px',
                      fontWeight: '700',
                      color: '#9a3412',
                      marginBottom: '12px'
                    }}>
                      {activity.title}
                    </h3>
                    <p style={{
                      color: '#c2410c',
                      fontSize: '14px',
                      marginBottom: '20px',
                      lineHeight: '1.6',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {activity.description}
                    </p>

                    {/* Info List */}
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '14px',
                        color: '#9a3412',
                        marginBottom: '10px'
                      }}>
                        <User style={{ width: '16px', height: '16px', marginRight: '10px', color: '#ff9a56', flexShrink: 0 }} />
                        <span style={{ fontWeight: '600' }}>Predavač:</span>
                        <span style={{ marginLeft: '8px' }}>{activity.instructor}</span>
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '14px',
                        color: '#9a3412',
                        marginBottom: '10px'
                      }}>
                        <Calendar style={{ width: '16px', height: '16px', marginRight: '10px', color: '#ff9a56', flexShrink: 0 }} />
                        <span>{activity.schedule.day}</span>
                        <span style={{ margin: '0 8px', color: '#fed7aa' }}>•</span>
                        <Clock style={{ width: '16px', height: '16px', marginRight: '6px', color: '#ff9a56' }} />
                        <span>{activity.schedule.time}</span>
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '14px',
                        color: '#9a3412',
                        marginBottom: '10px'
                      }}>
                        <MapPin style={{ width: '16px', height: '16px', marginRight: '10px', color: '#ff9a56', flexShrink: 0 }} />
                        <span>{activity.location}</span>
                      </div>

                      {activity.price > 0 && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: '14px',
                          color: '#9a3412',
                          marginBottom: '10px'
                        }}>
                          <DollarSign style={{ width: '16px', height: '16px', marginRight: '10px', color: '#ff9a56', flexShrink: 0 }} />
                          <span style={{ fontWeight: '700', color: '#ff9a56' }}>{activity.price} RSD</span>
                        </div>
                      )}

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '14px',
                        marginBottom: '10px'
                      }}>
                        <Users style={{ width: '16px', height: '16px', marginRight: '10px', color: '#ff9a56', flexShrink: 0 }} />
                        <span style={{
                          fontWeight: '600',
                          color: isFull ? '#e74c3c' : '#2ecc71'
                        }}>
                          {availableSpots} slobodnih mesta
                        </span>
                        <span style={{ marginLeft: '8px', color: '#c2410c', fontSize: '13px' }}>
                          ({activity.enrolled ? activity.enrolled.length : 0}/{activity.capacity})
                        </span>
                      </div>

                      <div style={{
                        fontSize: '13px',
                        color: '#c2410c',
                        padding: '8px 12px',
                        backgroundColor: '#fff7ed',
                        borderRadius: '8px',
                        display: 'inline-block',
                        border: '1px solid #fed7aa'
                      }}>
                        Uzrast: {activity.ageGroup.min}-{activity.ageGroup.max} godina
                      </div>
                    </div>

                    {/* Enroll Button */}
                    <button
                      onClick={() => handleEnroll(activity._id)}
                      disabled={isEnrolled || isFull || !selectedChild}
                      style={{
                        width: '100%',
                        padding: '14px',
                        borderRadius: '12px',
                        fontWeight: '700',
                        fontSize: '16px',
                        border: 'none',
                        cursor: isEnrolled || isFull || !selectedChild ? 'not-allowed' : 'pointer',
                        background: isEnrolled 
                          ? '#d4edda' 
                          : isFull || !selectedChild 
                          ? '#fed7aa' 
                          : 'linear-gradient(135deg, #ff9a56 0%, #ff7f3f 100%)',
                        color: isEnrolled 
                          ? '#155724' 
                          : isFull || !selectedChild 
                          ? '#c2410c' 
                          : 'white',
                        transition: 'all 0.3s',
                        boxShadow: isEnrolled || isFull || !selectedChild 
                          ? 'none' 
                          : '0 4px 15px rgba(255,154,86,0.4)'
                      }}
                      onMouseEnter={(e) => {
                        if (!isEnrolled && !isFull && selectedChild) {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 20px rgba(255,154,86,0.5)';
                          e.currentTarget.style.background = 'linear-gradient(135deg, #ff8542 0%, #ff6b2b 100%)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isEnrolled && !isFull && selectedChild) {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 15px rgba(255,154,86,0.4)';
                          e.currentTarget.style.background = 'linear-gradient(135deg, #ff9a56 0%, #ff7f3f 100%)';
                        }
                      }}
                    >
                      {isEnrolled
                        ? '✓ Prijavljeno'
                        : isFull
                        ? '✕ Popunjeno'
                        : !selectedChild
                        ? 'Izaberite dete'
                        : 'Prijavi dete'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default Extracurriculars;