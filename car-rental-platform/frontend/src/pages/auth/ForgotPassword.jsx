import { useState } from 'react';
import { authAPI } from '../../services/api';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Hook initialization

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await authAPI.forgotPassword({ email });
      setMessage(response.data.message || 'Reset code generated successfully.');

      // Automatically jump to the reset screen after a 2-second delay
      setTimeout(() => {
        navigate('/reset-password');
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Forgot Password</h1>
        
        {message && <div className="message success-message" style={{ color: 'green', marginBottom: '15px', fontWeight: 'bold' }}>{message}</div>}
        {error && <div className="error" style={{ marginBottom: '15px' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              required
            />
          </div>
          
          <button type="submit" className="button button-primary" disabled={loading}>
            {loading ? 'Processing...' : 'Send Reset Token'}
          </button>
        </form>

        <p className="auth-link">
          <Link to="/login">Back to Login</Link><br />
          <Link to="/reset-password">Have a code? Reset here</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;