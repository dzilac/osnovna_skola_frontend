import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AddPrivateLesson = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [professors, setProfessors] = useState([]);
  
  const [formData, setFormData] = useState({
    professorId: '',
    subject: '',
    description: '',
    grades: [],
    schedule: '',
    location: '',
    price: 1000,
    duration: 60,
    contactPhone: '',
    contactEmail: '',
    experience: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchProfessors();
  }, []);

  const fetchProfessors = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/professors', {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProfessors(data);
      }
    } catch (err) {
      console.error('Greška pri učitavanju profesora:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['price', 'duration'].includes(name) ? parseInt(value) : value
    }));
  };

  const handleGradeChange = (grade) => {
    setFormData(prev => ({
      ...prev,
      grades: prev.grades.includes(grade)
        ? prev.grades.filter(g => g !== grade)
        : [...prev.grades, grade]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.grades.length === 0) {
      setError('Morate izabrati bar jedan razred');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/admin/add-private-lesson', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/admin-dashboard');
        }, 2000);
      } else {
        setError(result.error || 'Greška pri dodavanju privatnog časa');
      }
    } catch (err) {
      console.error('Greška:', err);
      setError('Greška pri povezivanju sa serverom');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{
        minHeight: 'calc(100vh - 70px)',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '40px',
          maxWidth: '500px',
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <span style={{ fontSize: '48px', color: 'white' }}>✓</span>
          </div>
          <h2 style={{ color: '#2c3e50', marginBottom: '16px' }}>Privatni čas dodat!</h2>
          <p style={{ color: '#5a6c7d' }}>{formData.subject}</p>
          <p style={{ color: '#95a5a6', fontSize: '14px', marginTop: '12px' }}>
            Čas je automatski verifikovan
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 70px)',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '30px 20px'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <button
          onClick={() => navigate('/admin-dashboard')}
          style={{
            background: 'none',
            border: 'none',
            color: '#5a6c7d',
            fontSize: '16px',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          ← Nazad
        </button>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <span style={{ fontSize: '48px' }}>📚</span>
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '8px' }}>
              Dodaj Privatni Čas
            </h1>
            <p style={{ color: '#5a6c7d' }}>Kreiraj ponudu za privatne časove</p>
          </div>

          {error && (
            <div style={{
              backgroundColor: '#f8d7da',
              border: '1px solid #f5c6cb',
              color: '#721c24',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', color: '#2c3e50', fontWeight: '600', marginBottom: '8px' }}>
                  Profesor *
                </label>
                <select
                  name="professorId"
                  value={formData.professorId}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid #e9ecef',
                    fontSize: '15px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">Izaberite profesora</option>
                  {professors.map(prof => (
                    <option key={prof._id} value={prof._id}>
                      {prof.firstName} {prof.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', color: '#2c3e50', fontWeight: '600', marginBottom: '8px' }}>
                  Predmet *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="npr. Matematika"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid #e9ecef',
                    fontSize: '15px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#2c3e50', fontWeight: '600', marginBottom: '8px' }}>
                Opis časa *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Opišite šta nudite, metode rada, ciljeve..."
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #e9ecef',
                  fontSize: '15px',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#2c3e50', fontWeight: '600', marginBottom: '8px' }}>
                Razredi za koje se nudi čas *
              </label>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(grade => (
                  <button
                    key={grade}
                    type="button"
                    onClick={() => handleGradeChange(grade)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '8px',
                      border: formData.grades.includes(grade) ? '2px solid #e67e22' : '2px solid #e9ecef',
                      backgroundColor: formData.grades.includes(grade) ? '#fff3e0' : 'white',
                      color: formData.grades.includes(grade) ? '#e67e22' : '#5a6c7d',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {grade}. razred
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', color: '#2c3e50', fontWeight: '600', marginBottom: '8px' }}>
                  Raspored *
                </label>
                <input
                  type="text"
                  name="schedule"
                  value={formData.schedule}
                  onChange={handleChange}
                  required
                  placeholder="npr. Ponedeljak i Sreda 17-19h"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid #e9ecef',
                    fontSize: '15px',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#2c3e50', fontWeight: '600', marginBottom: '8px' }}>
                  Trajanje (min) *
                </label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid #e9ecef',
                    fontSize: '15px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="45">45 min</option>
                  <option value="60">60 min</option>
                  <option value="90">90 min</option>
                  <option value="120">120 min</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', color: '#2c3e50', fontWeight: '600', marginBottom: '8px' }}>
                  Lokacija *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="npr. Online ili kod učenika"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid #e9ecef',
                    fontSize: '15px',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#2c3e50', fontWeight: '600', marginBottom: '8px' }}>
                  Cena (RSD/čas) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="100"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid #e9ecef',
                    fontSize: '15px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', color: '#2c3e50', fontWeight: '600', marginBottom: '8px' }}>
                  Kontakt telefon *
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  required
                  placeholder="060/123-4567"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid #e9ecef',
                    fontSize: '15px',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#2c3e50', fontWeight: '600', marginBottom: '8px' }}>
                  Kontakt email *
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  required
                  placeholder="profesor@email.com"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid #e9ecef',
                    fontSize: '15px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: '#2c3e50', fontWeight: '600', marginBottom: '8px' }}>
                Iskustvo i kvalifikacije (opciono)
              </label>
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                rows="3"
                placeholder="Opišite vaše iskustvo, diplome, certifikate..."
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #e9ecef',
                  fontSize: '15px',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{
              backgroundColor: '#e3f2fd',
              border: '1px solid #bee5eb',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '24px'
            }}>
              <p style={{ fontSize: '13px', color: '#0c5460', margin: 0 }}>
                ℹ️ Privatni čas će biti automatski verifikovan jer ga dodaje admin.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                backgroundColor: loading ? '#95a5a6' : '#e67e22',
                color: 'white',
                padding: '14px',
                borderRadius: '10px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {loading ? '⏳ Dodajem...' : '✓ Dodaj Privatni Čas'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPrivateLesson;