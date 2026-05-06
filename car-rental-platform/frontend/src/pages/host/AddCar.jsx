import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { carAPI } from '../../services/api';
import './Host.css';

const AddCar = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    model: '',
    age: '',
    pricePerDay: '',
  });
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 4) {
      setError('Maximum 4 images allowed');
      return;
    }
    setImages(files);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('carRequest', new Blob([JSON.stringify(formData)], { type: 'application/json' }));

      images.forEach(image => {
        formDataToSend.append('images', image);
      });

      await carAPI.addCar(formDataToSend);
      alert('Car added successfully!');
      navigate('/host/manage-cars');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add car');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Add New Car</h1>

      <div className="form-container">
        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="model">Car Model</label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
              placeholder="e.g., Toyota Camry"
            />
          </div>

          <div className="form-group">
            <label htmlFor="age">Age (years)</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              min="0"
              placeholder="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="pricePerDay">Price per Day ($)</label>
            <input
              type="number"
              id="pricePerDay"
              name="pricePerDay"
              value={formData.pricePerDay}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="50.00"
            />
          </div>

          <div className="form-group">
            <label htmlFor="images">Upload Images (Max 4)</label>
            <input
              type="file"
              id="images"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              max="4"
            />
            {images.length > 0 && (
              <p className="image-count">{images.length} image(s) selected</p>
            )}
          </div>

          <button type="submit" className="button button-primary" disabled={loading}>
            {loading ? 'Adding Car...' : 'Add Car'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCar;
