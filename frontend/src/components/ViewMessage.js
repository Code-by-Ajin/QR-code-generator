import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Lock, Unlock, AlertCircle } from 'lucide-react';

const ViewMessage = () => {
  const { id } = useParams();
  const [password, setPassword] = useState('');
  const [messageData, setMessageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUnlock = async (e) => {
    e.preventDefault();
    setError(null);
    if (!password) {
      setError('Please enter the password.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`/api/message/${id}`, {
        password
      });
      setMessageData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to unlock message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card">
      {!messageData ? (
        <form onSubmit={handleUnlock}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ 
              display: 'inline-flex', 
              padding: '1rem', 
              borderRadius: '50%', 
              background: 'rgba(59, 130, 246, 0.1)',
              marginBottom: '1rem'
            }}>
              <Lock size={40} color="#3b82f6" />
            </div>
            <h2>Message Locked</h2>
            <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>
              Enter the password to view the hidden content.
            </p>
          </div>

          {error && (
            <div className="error-message">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <input
              type="password"
              className="form-control"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ textAlign: 'center', fontSize: '1.2rem', letterSpacing: '2px' }}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <Lock className="loader" size={20} /> : <Unlock size={20} />}
            {loading ? 'Verifying...' : 'Unlock Message'}
          </button>
        </form>
      ) : (
        <div className="message-display">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ 
              display: 'inline-flex', 
              padding: '1rem', 
              borderRadius: '50%', 
              background: 'rgba(16, 185, 129, 0.1)',
              marginBottom: '1rem'
            }}>
              <Unlock size={40} color="#10b981" />
            </div>
            <h2>Message Unlocked</h2>
          </div>

          {messageData.text && (
            <div className="message-text">
              {messageData.text}
            </div>
          )}

          {messageData.imageUrl && (
            <div style={{ textAlign: 'center' }}>
              <img 
                src={`${messageData.imageUrl}`} 
                alt="Hidden content" 
                className="message-image"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewMessage;
