import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { carAPI } from '../../services/api';
import './Customer.css';

const BrowseCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await carAPI.browseCars();
      setCars(response.data);
    } catch (err) {
      setError('Failed to load cars');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container"><p>Loading cars...</p></div>;

  return (
    <div className="container">
      <h1>Available Cars</h1>
      {error && <div className="error">{error}</div>}

      {cars.length === 0 ? (
        <p className="text-center">No cars available at the moment</p>
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
                <Link to={`/customer/car/${car.id}`} className="button button-primary">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseCars;
