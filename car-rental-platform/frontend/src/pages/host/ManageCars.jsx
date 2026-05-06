import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { carAPI } from '../../services/api';
import './Host.css';

const ManageCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await carAPI.getHostCars();
      setCars(response.data);
    } catch (err) {
      setError('Failed to load cars');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (carId) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await carAPI.deleteCar(carId);
        fetchCars();
        alert('Car deleted successfully');
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete car');
      }
    }
  };

  if (loading) return <div className="container"><p>Loading cars...</p></div>;

  return (
    <div className="container">
      <div className="manage-header">
        <h1>Manage Your Cars</h1>
        <Link to="/host/add-car" className="button button-primary">
          + Add New Car
        </Link>
      </div>

      {error && <div className="error">{error}</div>}

      {cars.length === 0 ? (
        <p className="text-center">No cars listed yet. <Link to="/host/add-car">Add your first car</Link></p>
      ) : (
        <div className="grid">
          {cars.map(car => (
            <div key={car.id} className="card">
              {car.imageUrls && car.imageUrls.length > 0 && (
                <img src={car.imageUrls[0]} alt={car.model} className="card-image" />
              )}
              <div className="card-body">
                <h3 className="card-title">{car.model}</h3>
                <p className="card-text">Age: {car.age} years</p>
                <p className="card-price">${car.pricePerDay}/day</p>
                <p className="card-text">Images: {car.imageUrls?.length || 0}/4</p>
                <div className="card-actions">
                  <Link to={`/host/edit-car/${car.id}`} className="button button-primary">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(car.id)}
                    className="button button-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageCars;
