import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { carAPI, bookingAPI } from '../../services/api';
import './Customer.css';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
  });
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    fetchCar();
  }, [id]);

  const fetchCar = async () => {
    try {
      const response = await carAPI.getCarById(id);
      setCar(response.data);
    } catch (err) {
      setError('Failed to load car details');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setError('');
    setBooking(true);

    try {
      await bookingAPI.createBooking({
        carId: parseInt(id),
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
      });

      alert('Booking successful!');
      navigate('/customer/bookings');
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <div className="container"><p>Loading...</p></div>;
  if (!car) return <div className="container"><p>Car not found</p></div>;

  const totalDays = bookingData.startDate && bookingData.endDate
    ? Math.ceil((new Date(bookingData.endDate) - new Date(bookingData.startDate)) / (1000 * 60 * 60 * 24))
    : 0;
  const totalPrice = totalDays > 0 ? totalDays * car.pricePerDay : 0;

  return (
    <div className="container">
      <button onClick={() => navigate(-1)} className="button button-secondary mb-20">
        ← Back
      </button>

      <div className="car-details">
        <div className="car-images">
          {car.imageUrls && car.imageUrls.length > 0 ? (
            <div className="image-gallery">
              {car.imageUrls.map((url, idx) => (
                <img key={idx} src={url} alt={`${car.model} ${idx + 1}`} className="detail-image" />
              ))}
            </div>
          ) : (
            <div className="no-image">No images available</div>
          )}
        </div>

        <div className="car-info">
          <h1>{car.model}</h1>
          <p className="car-age">Age: {car.age} years</p>
          <p className="car-price">${car.pricePerDay} per day</p>

          {error && <div className="error">{error}</div>}

          <form onSubmit={handleBooking} className="booking-form">
            <h3>Book This Car</h3>

            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={bookingData.startDate}
                onChange={handleBookingChange}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={bookingData.endDate}
                onChange={handleBookingChange}
                required
                min={bookingData.startDate || new Date().toISOString().split('T')[0]}
              />
            </div>

            {totalDays > 0 && (
              <div className="booking-summary">
                <p>Duration: {totalDays} day(s)</p>
                <p className="total-price">Total: ${totalPrice.toFixed(2)}</p>
              </div>
            )}

            <button type="submit" className="button button-success" disabled={booking}>
              {booking ? 'Booking...' : 'Confirm Booking'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
