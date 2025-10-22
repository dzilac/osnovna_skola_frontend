import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const RegisterChild = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',  // ← DODATO
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

    try {
      // Koristi FormData za upload slike
      const data = new FormData();
      data.append('firstName', formData.firstName);
      data.append('lastName', formData.lastName);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('grade', formData.grade);
      data.append('parentId', user.id);
      
      if (formData.profileImage) {
        data.append('profileImage', formData.profileImage);
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/register-child`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`
          // NE dodaj Content-Type - FormData će ga automatski postaviti
        },
        body: data
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/parent-dashboard');
        }, 3000);
      } else {
        setError(result.error || 'Greška pri registraciji');
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
        background: 'linear-gradient(135deg, #fff5f0 0%, #ffe8dc 100%)',
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
          <h2 style={{ color: '#2c3e50', marginBottom: '16px' }}>Uspešno registrovano!</h2>
          <p style={{ color: '#5a6c7d', marginBottom: '8px' }}>
            Nalog za {formData.firstName} {formData.lastName} je kreiran.
          </p>
          <p style={{ color: '#ff9a56', fontWeight: '600', fontSize: '14px' }}>
            ⏳ Nalog čeka verifikaciju od strane administratora škole.
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
      background: 'linear-gradient(135deg, #fff5f0 0%, #ffe8dc 100%)',
      padding: '30px 20px'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <button
          onClick={() => navigate('/parent-dashboard')}
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
              background: 'linear-gradient(135deg, #ff9a56 0%, #ff7f3f 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <span style={{ fontSize: '48px' }}>👶</span>
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '8px' }}>
              Registruj Dete
            </h1>
            <p style={{ color: '#5a6c7d' }}>Kreirajte nalog za vaše dete</p>
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
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#2c3e50', fontWeight: '600', marginBottom: '8px' }}>
                Ime
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

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#2c3e50', fontWeight: '600', marginBottom: '8px' }}>
                Prezime
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

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#2c3e50', fontWeight: '600', marginBottom: '8px' }}>
                Email (korisničko ime)
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

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#2c3e50', fontWeight: '600', marginBottom: '8px' }}>
                Lozinka
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

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#2c3e50', fontWeight: '600', marginBottom: '8px' }}>
                Razred
              </label>
              <select
                name="grade"
                value={formData.grade}
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
                {[1, 2, 3, 4, 5, 6, 7, 8].map(grade => (
                  <option key={grade} value={grade}>{grade}. razred</option>
                ))}
              </select>
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
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '24px'
            }}>
              <p style={{ fontSize: '13px', color: '#856404', margin: 0 }}>
                ℹ️ Nalog će biti kreiran, ali će čekati <strong>verifikaciju od strane administratora</strong> pre nego što dete može da koristi sistem.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                backgroundColor: loading ? '#95a5a6' : '#ff9a56',
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
              {loading ? '⏳ Registrujem...' : '✓ Registruj Dete'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterChild;