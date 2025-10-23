import React, { useState, useEffect } from 'react';
import { BookOpen, MapPin, Clock, DollarSign, Phone, Mail, Star, Award, Search, Filter, User, Users, Calendar } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const PrivateLessons = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('Svi razredi');
  const [selectedSubject, setSelectedSubject] = useState('Svi predmeti');
  const [sortBy, setSortBy] = useState('rating');
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState('');
  const [showContactInfo, setShowContactInfo] = useState({});
  const [error, setError] = useState('');

  const grades = ['Svi razredi', '1', '2', '3', '4', '5', '6', '7', '8'];
  const subjects = ['Svi predmeti', 'Matematika', 'Srpski jezik', 'Engleski jezik', 'Fizika', 'Hemija', 'Biologija', 'Istorija', 'Geografija', 'Informatika'];

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic'
    });
    fetchLessons();
    fetchChildren();
  }, []);

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

  const fetchLessons = async () => {
    try {
      const token = getToken();
      
      if (!token) {
        setError('Molimo prijavite se da biste videli privatne časove');
        setLoading(false);
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/private-lessons`, {
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
          setError('Greška pri učitavanju časova');
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      setLessons(Array.isArray(data) ? data.filter(lesson => lesson.isVerified && lesson.isActive) : []);
      setError('');
      setLoading(false);
    } catch (error) {
      console.error('Greška pri učitavanju časova:', error);
      setError('Greška pri komunikaciji sa serverom');
      setLessons([]);
      setLoading(false);
    }
  };

  const fetchChildren = async () => {
    try {
      const token = getToken();
      
      if (!token) {
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/children`, {
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

  const toggleContactInfo = (lessonId) => {
    setShowContactInfo(prev => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }));
  };

  const handleContact = (lesson) => {
    if (!selectedChild) {
      alert('Molimo izaberite dete pre kontaktiranja profesora');
      return;
    }
    
    const child = children.find(c => c._id === selectedChild);
    const message = `Poštovani,\n\nInteresuje me privatni čas iz predmeta ${lesson.subject} za moje dete ${child.firstName} ${child.lastName} (${child.grade}. razred).\n\nMolim Vas za više informacija.\n\nSrdačan pozdrav`;
    
    window.location.href = `mailto:${lesson.contactEmail}?subject=Upit za privatni čas - ${lesson.subject}&body=${encodeURIComponent(message)}`;
  };

  const filteredLessons = lessons.filter(lesson => {
    const professorName = lesson.professor ? `${lesson.professor.firstName || ''} ${lesson.professor.lastName || ''}` : '';
    const matchesSearch = 
      lesson.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professorName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGrade = selectedGrade === 'Svi razredi' || 
                         (lesson.grades && lesson.grades.includes(parseInt(selectedGrade)));
    
    const matchesSubject = selectedSubject === 'Svi predmeti' || 
                           lesson.subject === selectedSubject;
    
    // NOVO: Filtriraj po razredu izabranog deteta
    let matchesChildGrade = true;
    if (selectedChild) {
      const child = children.find(c => c._id === selectedChild);
      if (child && child.grade) {
        matchesChildGrade = lesson.grades && lesson.grades.includes(child.grade);
      }
    }
    
    return matchesSearch && matchesGrade && matchesSubject && matchesChildGrade;
  });

  const sortedLessons = [...filteredLessons].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return (b.averageRating || 0) - (a.averageRating || 0);
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  const getPriceColor = (price) => {
    if (price < 1000) return '#10b981';
    if (price < 2000) return '#f59e0b';
    return '#f97316';
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Učitavanje privatnih časova...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorBox}>
          <h2 style={styles.errorTitle}>⚠️ {error}</h2>
          <button onClick={() => window.location.reload()} style={styles.retryButton}>
            Pokušaj ponovo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.header} data-aos="fade-down">
          <h1 style={styles.title}>Privatni časovi</h1>
          <p style={styles.subtitle}>
            Pronađite najbolje profesore za dodatnu podršku u učenju
          </p>
        </div>

        {children.length > 0 && (
          <div style={styles.childSelection} data-aos="fade-up">
            <label style={styles.label}>
              <Users style={styles.icon} />
              Izaberite dete za kontaktiranje profesora:
            </label>
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              style={styles.select}
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

        <div style={styles.filtersContainer} data-aos="fade-up" data-aos-delay="100">
          <div style={styles.filterGrid}>
            <div style={styles.searchBox}>
              <label style={styles.label}>
                <Search style={styles.icon} />
                Pretraga
              </label>
              <input
                type="text"
                placeholder="Pretražite po predmetu, profesoru ili opisu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.input}
              />
            </div>

            <div>
              <label style={styles.label}>
                <Filter style={styles.icon} />
                Razred
              </label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                style={styles.select}
              >
                {grades.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={styles.label}>
                <BookOpen style={styles.icon} />
                Predmet
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                style={styles.select}
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={styles.sortContainer}>
            <div style={styles.sortButtons}>
              <span style={styles.sortLabel}>Sortiraj po:</span>
              <button
                onClick={() => setSortBy('rating')}
                style={{
                  ...styles.sortButton,
                  ...(sortBy === 'rating' ? styles.sortButtonActive : {})
                }}
              >
                <Star style={styles.sortIcon} />
                Oceni
              </button>
              <button
                onClick={() => setSortBy('price-low')}
                style={{
                  ...styles.sortButton,
                  ...(sortBy === 'price-low' ? styles.sortButtonActive : {})
                }}
              >
                Ceni ↑
              </button>
              <button
                onClick={() => setSortBy('price-high')}
                style={{
                  ...styles.sortButton,
                  ...(sortBy === 'price-high' ? styles.sortButtonActive : {})
                }}
              >
                Ceni ↓
              </button>
            </div>
            <div style={styles.resultCount}>
              Pronađeno: <span style={styles.resultNumber}>{sortedLessons.length}</span> časova
            </div>
          </div>
        </div>

        {sortedLessons.length === 0 ? (
          <div style={styles.emptyState} data-aos="fade-in">
            <BookOpen style={styles.emptyIcon} />
            <h3 style={styles.emptyTitle}>Nema dostupnih časova</h3>
            <p style={styles.emptyText}>
              Pokušajte sa drugom pretragom ili filterima
            </p>
          </div>
        ) : (
          <div style={styles.lessonsGrid}>
            {sortedLessons.map((lesson, index) => (
              <div
                key={lesson._id}
                style={styles.lessonCard}
                data-aos="fade-up"
                data-aos-delay={index * 50}
              >
                <div style={styles.cardHeader}>
                  <div style={styles.headerContent}>
                    <h3 style={styles.lessonTitle}>{lesson.subject}</h3>
                    <div style={styles.professorInfo}>
                      <User style={styles.smallIcon} />
                      <span style={styles.professorName}>
                        {lesson.professor ? `${lesson.professor.firstName} ${lesson.professor.lastName}` : 'Profesor'}
                      </span>
                    </div>
                  </div>
                  <div style={styles.ratingBox}>
                    <div style={styles.ratingContent}>
                      <Star style={styles.starIcon} />
                      <span style={styles.ratingValue}>{lesson.averageRating || 'N/A'}</span>
                    </div>
                    <div style={styles.reviewCount}>
                      {lesson.reviews?.length || 0} recenzija
                    </div>
                  </div>
                </div>

                <div style={styles.gradesBadges}>
                  {lesson.grades && lesson.grades.map(grade => (
                    <span key={grade} style={styles.gradeBadge}>
                      {grade}. razred
                    </span>
                  ))}
                </div>

                <div style={styles.cardBody}>
                  <p style={styles.description}>{lesson.description}</p>

                  <div style={styles.infoList}>
                    <div style={styles.infoRow}>
                      <Clock style={styles.infoIconStyle} />
                      <div>
                        <span style={styles.infoLabel}>Trajanje:</span>
                        <span style={styles.infoText}> {lesson.duration} minuta</span>
                      </div>
                    </div>

                    <div style={styles.infoRow}>
                      <Calendar style={styles.infoIconStyle} />
                      <div>
                        <span style={styles.infoLabel}>Raspored:</span>
                        <span style={styles.infoText}> {lesson.schedule}</span>
                      </div>
                    </div>

                    <div style={styles.infoRow}>
                      <MapPin style={styles.infoIconStyle} />
                      <div>
                        <span style={styles.infoLabel}>Lokacija:</span>
                        <span style={styles.infoText}> {lesson.location}</span>
                      </div>
                    </div>

                    <div style={styles.infoRow}>
                      <DollarSign style={styles.infoIconStyle} />
                      <div>
                        <span style={styles.infoLabel}>Cena:</span>
                        <span style={{
                          ...styles.priceText,
                          color: getPriceColor(lesson.price)
                        }}>
                          {lesson.price} RSD
                        </span>
                        <span style={styles.priceNote}> po času</span>
                      </div>
                    </div>

                    {lesson.experience && (
                      <div style={styles.infoRow}>
                        <Award style={styles.infoIconStyle} />
                        <div>
                          <span style={styles.infoLabel}>Iskustvo:</span>
                          <span style={styles.infoText}> {lesson.experience}</span>
                        </div>
                      </div>
                    )}

                    {lesson.certificates && lesson.certificates.length > 0 && (
                      <div style={styles.infoRow}>
                        <Award style={styles.infoIconStyle} />
                        <div style={{width: '100%'}}>
                          <span style={styles.infoLabel}>Sertifikati:</span>
                          <div style={styles.certificatesList}>
                            {lesson.certificates.map((cert, idx) => (
                              <div key={idx} style={styles.certificate}>
                                • {cert}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={styles.contactSection}>

                    {showContactInfo[lesson._id] && (
                      <div style={styles.contactInfo}>
                        <div style={styles.contactItem}>
                          <Phone style={styles.contactIcon} />
                          <a href={`tel:${lesson.contactPhone}`} style={styles.contactLink}>
                            {lesson.contactPhone}
                          </a>
                        </div>
                        <div style={styles.contactItem}>
                          <Mail style={styles.contactIcon} />
                          <a href={`mailto:${lesson.contactEmail}`} style={styles.contactLink}>
                            {lesson.contactEmail}
                          </a>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => handleContact(lesson)}
                      disabled={!selectedChild}
                      style={{
                        ...styles.contactButton,
                        ...(!selectedChild ? styles.contactButtonDisabled : {})
                      }}
                    >
                      {!selectedChild ? 'Izaberite dete' : 'Kontaktiraj profesora'}
                    </button>
                  </div>

                  {lesson.reviews && lesson.reviews.length > 0 && (
                    <div style={styles.reviewsSection}>
                      <h4 style={styles.reviewsTitle}>
                        <Star style={styles.reviewIcon} />
                        Recenzije roditelja
                      </h4>
                      <div style={styles.reviewsList}>
                        {lesson.reviews.slice(0, 2).map((review, idx) => (
                          <div key={idx} style={styles.reviewCard}>
                            <div style={styles.reviewHeader}>
                              <div style={styles.starsContainer}>
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    style={{
                                      ...styles.reviewStar,
                                      ...(i < review.rating ? styles.reviewStarFilled : {})
                                    }}
                                  />
                                ))}
                              </div>
                              <span style={styles.reviewDate}>
                                {new Date(review.createdAt).toLocaleDateString('sr-RS')}
                              </span>
                            </div>
                            <p style={styles.reviewComment}>"{review.comment}"</p>
                          </div>
                        ))}
                        {lesson.reviews.length > 2 && (
                          <p style={styles.moreReviews}>
                            + još {lesson.reviews.length - 2} recenzija
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={styles.infoBox} data-aos="fade-up">
          <h3 style={styles.infoBoxTitle}>Kako funkcionišu privatni časovi?</h3>
          <div style={styles.stepsGrid}>
            <div style={styles.step}>
              <div style={styles.stepNumber}>1</div>
              <h4 style={styles.stepTitle}>Izaberite dete</h4>
              <p style={styles.stepText}>
                Prvo izaberite dete iz padajućeg menija kako biste mogli kontaktirati profesora
              </p>
            </div>
            <div style={styles.step}>
              <div style={styles.stepNumber}>2</div>
              <h4 style={styles.stepTitle}>Pronađite profesora</h4>
              <p style={styles.stepText}>
                Pretražite časove po predmetu i razredu, uporedite cene i recenzije
              </p>
            </div>
            <div style={styles.step}>
              <div style={styles.stepNumber}>3</div>
              <h4 style={styles.stepTitle}>Kontaktirajte i dogovorite se</h4>
              <p style={styles.stepText}>
                Direktno kontaktirajte profesora i dogovorite termin koji vama odgovara
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #fff7ed 0%, #ffffff 50%, #ffedd5 100%)',
    padding: '2rem 1rem'
  },
  content: {
    maxWidth: '1280px',
    margin: '0 auto'
  },
  loadingContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #fff7ed 0%, #ffffff 50%, #ffedd5 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  spinner: {
    width: '64px',
    height: '64px',
    border: '4px solid #fed7aa',
    borderTop: '4px solid #f97316',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem'
  },
  emptyIcon: {
  width: '6rem',
  height: '6rem',
  color: '#fed7aa',
  margin: '0 auto 1rem',
  animation: 'float 3s ease-in-out infinite'  // DODAJ OVO
},
  loadingText: {
    color: '#9a3412',
    fontSize: '1.125rem',
    fontWeight: '500'
  },
  errorContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #fff7ed 0%, #ffffff 50%, #ffedd5 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem'
  },
  errorBox: {
    backgroundColor: 'white',
    padding: '3rem',
    borderRadius: '1.5rem',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    maxWidth: '500px',
    border: '2px solid #fed7aa'
  },
  errorTitle: {
    color: '#dc2626',
    fontSize: '1.5rem',
    marginBottom: '1.5rem'
  },
  retryButton: {
    padding: '0.75rem 2rem',
    backgroundColor: '#f97316',
    color: 'white',
    border: 'none',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  header: {
    textAlign: 'center',
    marginBottom: '3rem'
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '1rem'
  },
  subtitle: {
    fontSize: '1.125rem',
    color: '#9a3412',
    maxWidth: '42rem',
    margin: '0 auto'
  },
  childSelection: {
    backgroundColor: 'white',
    borderRadius: '1rem',
    boxShadow: '0 10px 15px -3px rgba(249, 115, 22, 0.1)',
    padding: '1.5rem',
    marginBottom: '2rem',
    border: '2px solid #fed7aa'
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#9a3412',
    marginBottom: '0.75rem'
  },
  icon: {
    width: '1rem',
    height: '1rem',
    marginRight: '0.5rem'
  },
  select: {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '2px solid #fed7aa',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    outline: 'none',
    color: '#9a3412'
  },
  filtersContainer: {
    backgroundColor: 'white',
    borderRadius: '1rem',
    boxShadow: '0 10px 15px -3px rgba(249, 115, 22, 0.1)',
    padding: '1.5rem',
    marginBottom: '2rem',
    border: '2px solid #fed7aa'
  },
  filterGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr',
    gap: '1.5rem',
    marginBottom: '1.5rem'
  },
  searchBox: {
    gridColumn: 'span 1'
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '2px solid #fed7aa',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    outline: 'none'
  },
  sortContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
    borderTop: '1px solid #fed7aa',
    paddingTop: '1.5rem'
  },
  sortButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  sortLabel: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#9a3412'
  },
  sortButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#ffedd5',
    color: '#9a3412',
    transition: 'all 0.2s'
  },
  sortButtonActive: {
    backgroundColor: '#f97316',
    color: 'white',
    boxShadow: '0 10px 15px -3px rgba(249, 115, 22, 0.3)'
  },
  sortIcon: {
    width: '1rem',
    height: '1rem',
    marginRight: '0.25rem'
  },
  resultCount: {
    fontSize: '0.875rem',
    color: '#9a3412'
  },
  resultNumber: {
    fontWeight: 'bold',
    color: '#f97316'
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem 1rem',
    backgroundColor: 'white',
    borderRadius: '1rem',
    boxShadow: '0 10px 15px -3px rgba(249, 115, 22, 0.1)',
    border: '2px solid #fed7aa'
  },
  emptyIcon: {
    width: '6rem',
    height: '6rem',
    color: '#fed7aa',
    margin: '0 auto 1rem'
  },
  emptyTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#9a3412',
    marginBottom: '0.5rem'
  },
  emptyText: {
    color: '#c2410c'
  },
  lessonsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))',
    gap: '1.5rem'
  },
  lessonCard: {
    backgroundColor: 'white',
    borderRadius: '1rem',
    boxShadow: '0 10px 15px -3px rgba(249, 115, 22, 0.1)',
    overflow: 'hidden',
    transition: 'all 0.3s',
    border: '2px solid #fed7aa'
  },
  cardHeader: {
    background: 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)',
    padding: '1.5rem',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  headerContent: {
    flex: 1
  },
  lessonTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem'
  },
  professorInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  smallIcon: {
    width: '1rem',
    height: '1rem'
  },
  professorName: {
    fontSize: '0.875rem',
    fontWeight: '500'
  },
  ratingBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    padding: '1rem',
    borderRadius: '0.75rem',
    textAlign: 'center'
  },
  ratingContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '0.25rem'
  },
  starIcon: {
    width: '1.25rem',
    height: '1.25rem',
    fill: '#fbbf24',
    color: '#fbbf24',
    marginRight: '0.25rem'
  },
  ratingValue: {
    fontSize: '1.25rem',
    fontWeight: 'bold'
  },
  reviewCount: {
    fontSize: '0.75rem',
    opacity: 0.9
  },
  gradesBadges: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    padding: '1rem 1.5rem',
    backgroundColor: '#fff7ed',
    borderBottom: '1px solid #fed7aa'
  },
  gradeBadge: {
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    color: '#f97316',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '500'
  },
  cardBody: {
    padding: '1.5rem'
  },
  description: {
    color: '#9a3412',
    marginBottom: '1.5rem',
    lineHeight: '1.6'
  },
  infoList: {
    marginBottom: '1.5rem'
  },
  infoRow: {
    display: 'flex',
    alignItems: 'flex-start',
    fontSize: '0.875rem',
    marginBottom: '0.75rem'
  },
  infoIconStyle: {
    width: '1.25rem',
    height: '1.25rem',
    marginRight: '0.75rem',
    flexShrink: 0,
    marginTop: '0.125rem',
    color: '#f97316'
  },
  infoLabel: {
    fontWeight: '600',
    color: '#9a3412'
  },
  infoText: {
    color: '#9a3412'
  },
  priceText: {
    fontSize: '1.125rem',
    fontWeight: 'bold',
    marginLeft: '0.5rem'
  },
  priceNote: {
    color: '#c2410c',
    fontSize: '0.75rem',
    marginLeft: '0.25rem'
  },
  certificatesList: {
    marginTop: '0.5rem'
  },
  certificate: {
    fontSize: '0.75rem',
    color: '#9a3412',
    backgroundColor: '#fff7ed',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    marginTop: '0.25rem'
  },
  contactSection: {
    borderTop: '1px solid #fed7aa',
    paddingTop: '1.5rem'
  },
  toggleButton: {
    width: '100%',
    marginBottom: '1rem',
    padding: '0.75rem',
    backgroundColor: '#ffedd5',
    color: '#9a3412',
    borderRadius: '0.75rem',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  contactInfo: {
    backgroundColor: '#fff7ed',
    padding: '1rem',
    borderRadius: '0.75rem',
    marginBottom: '1rem',
    border: '1px solid #fed7aa'
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.875rem',
    marginBottom: '0.75rem'
  },
  contactIcon: {
    width: '1rem',
    height: '1rem',
    marginRight: '0.75rem',
    color: '#f97316'
  },
  contactLink: {
    color: '#f97316',
    textDecoration: 'none',
    fontWeight: '500'
  },
  contactButton: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '0.75rem',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)',
    color: 'white',
    transition: 'all 0.2s',
    fontSize: '1rem',
    boxShadow: '0 4px 6px -1px rgba(249, 115, 22, 0.3)'
  },
  contactButtonDisabled: {
    background: '#fed7aa',
    color: '#c2410c',
    cursor: 'not-allowed',
    boxShadow: 'none'
  },
  reviewsSection: {
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #fed7aa'
  },
  reviewsTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#9a3412',
    marginBottom: '0.75rem',
    display: 'flex',
    alignItems: 'center'
  },
  reviewIcon: {
    width: '1rem',
    height: '1rem',
    marginRight: '0.5rem',
    color: '#fbbf24'
  },
  reviewsList: {
  },
  reviewCard: {
    backgroundColor: '#fff7ed',
    padding: '1rem',
    borderRadius: '0.75rem',
    marginBottom: '0.75rem',
    border: '1px solid #fed7aa'
  },
  reviewHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '0.5rem'
  },
  starsContainer: {
    display: 'flex',
    gap: '0.125rem'
  },
  reviewStar: {
    width: '1rem',
    height: '1rem',
    color: '#fed7aa'
  },
  reviewStarFilled: {
    fill: '#fbbf24',
    color: '#fbbf24'
  },
  reviewDate: {
    fontSize: '0.75rem',
    color: '#c2410c'
  },
  reviewComment: {
    fontSize: '0.875rem',
    color: '#9a3412',
    fontStyle: 'italic'
  },
  moreReviews: {
    fontSize: '0.75rem',
    color: '#c2410c',
    textAlign: 'center',
    marginTop: '0.5rem'
  },
  infoBox: {
    marginTop: '3rem',
    background: 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)',
    borderRadius: '1rem',
    boxShadow: '0 20px 25px -5px rgba(249, 115, 22, 0.2)',
    padding: '2rem',
    color: 'white'
  },
  infoBoxTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem'
  },
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1.5rem'
  },
  step: {
  },
  stepNumber: {
    width: '3rem',
    height: '3rem',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '0.75rem'
  },
  stepTitle: {
    fontWeight: '600',
    marginBottom: '0.5rem'
  },
  stepText: {
    fontSize: '0.875rem',
    opacity: 0.9,
    lineHeight: '1.5'
  }
};


const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  
  @media (max-width: 1024px) {
    .lessonsGrid {
      grid-template-columns: 1fr !important;
    }
    .filterGrid {
      grid-template-columns: 1fr !important;
    }
    .stepsGrid {
      grid-template-columns: 1fr !important;
    }
  }
  
  button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(249, 115, 22, 0.4) !important;
  }
  
  .lessonCard:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 25px -5px rgba(249, 115, 22, 0.2) !important;
  }

  input:focus, select:focus {
    border-color: #ff9a56 !important;
    box-shadow: 0 0 0 3px rgba(255,154,86,0.1) !important;
  }
`;
document.head.appendChild(styleSheet);

export default PrivateLessons;