import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AddUser = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Roditelj',
    grade: 1,
    profileImage: null
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profileImage') {
      setFormData(prev => ({ ...prev, profileImage: files[0] }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'grade' ? parseInt(value) : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Proveri da li se lozinke poklapaju
    if (formData.password !== formData.confirmPassword) {
      setError('Lozinke se ne poklapaju.');
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append('firstName', formData.firstName);
      data.append('lastName', formData.lastName);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('role', formData.role);
      data.append('grade', formData.grade);
      
      if (formData.profileImage) {
        data.append('profileImage', formData.profileImage);
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/add-user`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`
        },
        body: data
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/admin-dashboard');
        }, 2000);
      } else {
        setError(result.error || 'Greška pri dodavanju korisnika');
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
          <h2 style={{ color: '#2c3e50', marginBottom: '16px' }}>Korisnik uspešno dodat!</h2>
          <p style={{ color: '#5a6c7d', marginBottom: '8px' }}>
            {formData.firstName} {formData.lastName} ({formData.role})
          </p>
          <p style={{ color: '#95a5a6', fontSize: '13px', marginTop: '16px' }}>
            Preusmeravanje na dashboard...
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
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <button
          onClick={() => navigate('/admin-dashboard')}
          style={{
            background: 'none',
            border: 'none',
            color: '#5a6c7d',
            fontSize: '16px',
            cursor: 'pointer',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          ← Nazad na dashboard
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
              background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <span style={{ fontSize: '48px' }}>👤</span>
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '8px' }}>
              Dodaj Novog Korisnika
            </h1>
            <p style={{ color: '#5a6c7d' }}>Kreiraj nalog za novog korisnika</p>
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
                  Ime *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
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
                  Prezime *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
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
                Email (korisničko ime) *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', color: '#2c3e50', fontWeight: '600', marginBottom: '8px' }}>
                  Lozinka *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
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
                  Ponovi lozinku *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength="6"
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
                  Uloga *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid #e9ecef',
                    fontSize: '15px',
                    outline: 'none',
                    cursor: 'pointer',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="Roditelj">👨‍👩‍👧 Roditelj</option>
                  <option value="Profesor">👨‍🏫 Profesor</option>
                  <option value="Dete">👶 Dete</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', color: '#2c3e50', fontWeight: '600', marginBottom: '8px' }}>
                  Razred {formData.role === 'Dete' ? '*' : '(opciono)'}
                </label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  required={formData.role === 'Dete'}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid #e9ecef',
                    fontSize: '15px',
                    outline: 'none',
                    cursor: 'pointer',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="0">Nije učenik</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(grade => (
                    <option key={grade} value={grade}>{grade}. razred</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: '#2c3e50', fontWeight: '600', marginBottom: '8px' }}>
                Profilna slika (opciono)
              </label>
              <input
                type="file"
                name="profileImage"
                accept="image/*"
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #e9ecef',
                  fontSize: '15px',
                  outline: 'none',
                  cursor: 'pointer',
                  backgroundColor: 'white'
                }}
              />
              {formData.profileImage && (
                <p style={{ fontSize: '13px', color: '#28a745', marginTop: '8px', marginBottom: 0 }}>
                  ✓ Izabrano: {formData.profileImage.name}
                </p>
              )}
            </div>

            <div style={{
              backgroundColor: '#e3f2fd',
              border: '1px solid #bee5eb',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '24px'
            }}>
              <p style={{ fontSize: '13px', color: '#0c5460', margin: 0 }}>
                ℹ️ {formData.role === 'Dete' 
                  ? 'Dete će biti automatski verifikovano jer ga dodaje admin.'
                  : 'Korisnik će biti automatski verifikovan i moći će odmah da se uloguje.'}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                backgroundColor: loading ? '#95a5a6' : '#3498db',
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
              {loading ? '⏳ Dodajem...' : '✓ Dodaj Korisnika'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;