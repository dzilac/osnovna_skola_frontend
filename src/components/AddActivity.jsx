import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AddActivity = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Sport',
    instructor: '',
    day: 'Ponedeljak',
    time: '',
    location: '',
    capacity: 20,
    price: 0,
    ageMin: 6,
    ageMax: 15,
    image: null
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData(prev => ({ ...prev, image: files[0] }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: ['capacity', 'price', 'ageMin', 'ageMax'].includes(name) ? parseInt(value) : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('instructor', formData.instructor);
      data.append('day', formData.day);
      data.append('time', formData.time);
      data.append('location', formData.location);
      data.append('capacity', formData.capacity);
      data.append('price', formData.price);
      data.append('ageMin', formData.ageMin);
      data.append('ageMax', formData.ageMax);
      
      if (formData.image) {
        data.append('image', formData.image);
      }

      const response = await fetch('http://localhost:5000/api/admin/add-activity', {
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
        setError(result.error || 'Greška pri dodavanju aktivnosti');
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
          <h2 style={{ color: '#2c3e50', marginBottom: '16px' }}>Aktivnost dodata!</h2>
          <p style={{ color: '#5a6c7d' }}>{formData.title}</p>
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
              background: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <span style={{ fontSize: '48px' }}>🎨</span>
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '8px' }}>
              Dodaj Vannastavnu Aktivnost
            </h1>
            <p style={{ color: '#5a6c7d' }}>Kreiraj novu aktivnost za učenike</p>
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
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', color: '#2c3e50', fontWeight: '600', marginBottom: '8px' }}>
                  Naziv aktivnosti *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="npr. Košarka za početnike"
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
                  Kategorija *
                </label>
                <select
                  name="category"
                  value={formData.category}
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
                  <option value="Sport">🏀 Sport</option>
                  <option value="Umetnost">🎨 Umetnost</option>
                  <option value="Nauka">🔬 Nauka</option>
                  <option value="Muzika">🎵 Muzika</option>
                  <option value="Tehnologija">💻 Tehnologija</option>
                  <option value="Jezik">🌍 Jezik</option>
                  <option value="Ostalo">📚 Ostalo</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#2c3e50', fontWeight: '600', marginBottom: '8px' }}>
                Opis aktivnosti *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Detaljan opis aktivnosti..."
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', color: '#2c3e50', fontWeight: '600', marginBottom: '8px' }}>
                  Instruktor *
                </label>
                <input
                  type="text"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleChange}
                  required
                  placeholder="Ime instruktora"
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
                  Dan *
                </label>
                <select
                  name="day"
                  value={formData.day}
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
                  {['Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota', 'Nedelja'].map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', color: '#2c3e50', fontWeight: '600', marginBottom: '8px' }}>
                  Vreme *
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
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

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
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
                  placeholder="npr. Sala 101"
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
                  Kapacitet *
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                  min="1"
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
                  Cena (RSD)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
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
                  Uzrast od (godina) *
                </label>
                <input
                  type="number"
                  name="ageMin"
                  value={formData.ageMin}
                  onChange={handleChange}
                  required
                  min="6"
                  max="15"
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
                  Uzrast do (godina) *
                </label>
                <input
                  type="number"
                  name="ageMax"
                  value={formData.ageMax}
                  onChange={handleChange}
                  required
                  min="6"
                  max="15"
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
                Slika aktivnosti (opciono)
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #e9ecef',
                  fontSize: '15px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              />
              {formData.image && (
                <p style={{ fontSize: '13px', color: '#28a745', marginTop: '8px', marginBottom: 0 }}>
                  ✓ Izabrano: {formData.image.name}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                backgroundColor: loading ? '#95a5a6' : '#9b59b6',
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
              {loading ? '⏳ Dodajem...' : '✓ Dodaj Aktivnost'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddActivity;