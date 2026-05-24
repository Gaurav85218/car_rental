import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { carAPI, bookingAPI } from '../../services/api';
import BookingCalendar from './BookingCalendar';
import './Customer.css';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car,          setCar]          = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState('');
  const [bookedRanges, setBookedRanges] = useState([]);
  const [selStart,     setSelStart]     = useState(null);
  const [selEnd,       setSelEnd]       = useState(null);
  const [booking,      setBooking]      = useState(false);

  useEffect(() => {
    fetchCar();
    fetchBookedDates();
  }, [id]);

  const fetchCar = async () => {
    try {
      const res = await carAPI.getCarById(id);
      setCar(res.data);
    } catch {
      setError('Failed to load car details');
    } finally {
      setLoading(false);
    }
  };

 

const fetchBookedDates = async () => {
    try {
      const res = await bookingAPI.getBookedDatesForCar(id);
      
      // ADD THESE LOGS
      console.log('Status:', res.status);
      console.log('Raw data:', res.data);
      console.log('Type:', typeof res.data);
      console.log('Is array:', Array.isArray(res.data));
      console.log('First item:', res.data[0]);
      
      setBookedRanges(res.data);
    } catch (e) {
      console.error('Error:', e.response?.status, e.response?.data);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selStart || !selEnd) return;
    setBooking(true);
    try {
      await bookingAPI.createBooking({
        carId:     parseInt(id),
        startDate: selStart.toISOString().split('T')[0],
        endDate:   selEnd.toISOString().split('T')[0],
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
  if (!car)    return <div className="container"><p>Car not found</p></div>;

  const totalDays = selStart && selEnd
    ? Math.ceil((selEnd - selStart) / (1000 * 60 * 60 * 24))
    : 0;
  const totalPrice = totalDays > 0 ? totalDays * car.pricePerDay : 0;

  return (
    <div className="container">
      <button onClick={() => navigate(-1)} className="button button-secondary mb-20">
        ← Back
      </button>

      <div className="car-details">
        {/* Left: images */}
        <div className="car-images">
          {car.imageUrls?.length > 0 ? (
            <div className="image-gallery">
              {car.imageUrls.map((url, idx) => (
                <img key={idx} src={url} alt={`${car.model} ${idx + 1}`} className="detail-image" />
              ))}
            </div>
          ) : (
            <div className="no-image">No images available</div>
          )}
        </div>

        {/* Right: info + booking */}
        <div className="car-info">
          <h1>{car.model}</h1>
          <p className="car-age">Age: {car.age} years</p>
          <p className="car-price">${car.pricePerDay} per day</p>

          {error && <div className="error">{error}</div>}

          <form onSubmit={handleBooking}>
            <h3 style={{ marginBottom: 12 }}>Book This Car</h3>

            <BookingCalendar
              bookedRanges={bookedRanges}
              onRangeSelect={(start, end) => {
                setSelStart(start);
                setSelEnd(end);
                setError('');
              }}
            />

            {/* selected range pill */}
            {selStart && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: '#f8fafc', border: '1px solid #e2e8f0',
                borderRadius: 8, padding: '10px 14px', marginBottom: 14,
                fontSize: 14
              }}>
                <div>
                  <div style={{ fontSize: 11, color: '#6b7280' }}>Start</div>
                  <strong>
                    {selStart.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </strong>
                </div>
                <span style={{ color: '#9ca3af', fontSize: 18 }}>→</span>
                <div>
                  <div style={{ fontSize: 11, color: '#6b7280' }}>End</div>
                  <strong>
                    {selEnd
                      ? selEnd.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                      : 'pick end date'}
                  </strong>
                </div>
              </div>
            )}

            {totalDays > 0 && (
              <div className="booking-summary">
                <p>Duration: {totalDays} day(s)</p>
                <p className="total-price">Total: ${totalPrice.toFixed(2)}</p>
              </div>
            )}

            <button
              type="submit"
              className="button button-success"
              disabled={booking || !selStart || !selEnd}
            >
              {booking ? 'Booking...' : 'Confirm Booking'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;