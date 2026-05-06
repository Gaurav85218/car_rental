import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { carAPI } from '../../services/api';
import './Host.css';

const EditCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    model: '',
    age: '',
    pricePerDay: '',
  });
  const [car, setCar] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchCar();
  }, [id]);

  const fetchCar = async () => {
    try {
      const response = await carAPI.getCarById(id);
      setCar(response.data);
      setFormData({
        model: response.data.model,
        age: response.data.age,
        pricePerDay: response.data.pricePerDay,
      });
    } catch (err) {
      setError('Failed to load car');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = (car?.imageUrls?.length || 0) + files.length;
    if (totalImages > 4) {
      setError(`Maximum 4 images allowed. You have ${car?.imageUrls?.length || 0} existing images.`);
      return;
    }
    setNewImages(files);
    setError('');
  };

  const handleRemoveImage = async (imageUrl) => {
    if (window.confirm('Remove this image?')) {
      try {
        await carAPI.removeImage(id, imageUrl);
        fetchCar();
      } catch (err) {
        alert('Failed to remove image');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUpdating(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('carRequest', new Blob([JSON.stringify(formData)], { type: 'application/json' }));

      newImages.forEach(image => {
        formDataToSend.append('images', image);
      });

      await carAPI.updateCar(id, formDataToSend);
      alert('Car updated successfully!');
      navigate('/host/manage-cars');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update car');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="container"><p>Loading...</p></div>;
  if (!car) return <div className="container"><p>Car not found</p></div>;

  return (
    <div className="container">
      <button onClick={() => navigate(-1)} className="button button-secondary mb-20">
        ← Back
      </button>

      <h1>Edit Car</h1>

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
            />
          </div>

          <div className="form-group">
            <label>Current Images ({car.imageUrls?.length || 0}/4)</label>
            <div className="image-gallery">
              {car.imageUrls?.map((url, idx) => (
                <div key={idx} className="image-item">
                  <img src={url} alt={`Car ${idx + 1}`} />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(url)}
                    className="button button-danger"
                    style={{ marginTop: '5px' }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {(car.imageUrls?.length || 0) < 4 && (
            <div className="form-group">
              <label htmlFor="newImages">Add More Images</label>
              <input
                type="file"
                id="newImages"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
              {newImages.length > 0 && (
                <p className="image-count">{newImages.length} new image(s) selected</p>
              )}
            </div>
          )}

          <button type="submit" className="button button-primary" disabled={updating}>
            {updating ? 'Updating...' : 'Update Car'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCar;
