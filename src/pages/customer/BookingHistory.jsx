import React, { useState, useEffect } from 'react';
import { bookingAPI } from '../../services/api';
import './Customer.css';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getMyBookings();
      setBookings(response.data);
    } catch (err) {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingAPI.cancelBooking(bookingId);
        fetchBookings();
        alert('Booking cancelled successfully');
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to cancel booking');
      }
    }
  };

  if (loading) return <div className="container"><p>Loading bookings...</p></div>;

  return (
    <div className="container">
      <h1>My Bookings</h1>
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
              <th>Action</th>
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
                <td>
                  {booking.status === 'CONFIRMED' && (
                    <button
                      onClick={() => handleCancel(booking.id)}
                      className="button button-danger"
                      style={{ padding: '5px 10px', fontSize: '12px' }}
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BookingHistory;
