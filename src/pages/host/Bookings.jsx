import React, { useState, useEffect } from 'react';
import { bookingAPI } from '../../services/api';
import './Host.css';

const HostBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getHostBookings();
      setBookings(response.data);
    } catch (err) {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container"><p>Loading bookings...</p></div>;

  return (
    <div className="container">
      <h1>Bookings for Your Cars</h1>
      {error && <div className="error">{error}</div>}

      {bookings.length === 0 ? (
        <p className="text-center">No bookings yet</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Car Model</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Total Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking.id}>
                <td>{booking.car?.model}</td>
                <td>{new Date(booking.startDate).toLocaleDateString()}</td>
                <td>{new Date(booking.endDate).toLocaleDateString()}</td>
                <td>${booking.totalPrice.toFixed(2)}</td>
                <td>
                  <span className={`badge badge-${booking.status === 'CONFIRMED' ? 'success' : booking.status === 'CANCELLED' ? 'danger' : 'primary'}`}>
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HostBookings;
