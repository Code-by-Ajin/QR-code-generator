import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import { Lock, Image as ImageIcon, FileText, Send, AlertCircle, Share2, Download } from 'lucide-react';

const CreateMessage = () => {
  const [text, setText] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [createdId, setCreatedId] = useState(null);
  const [localIp, setLocalIp] = useState(window.location.hostname);

  const qrRef = useRef(null);

  useEffect(() => {
    // Fetch the backend's local IP address so the QR code can be scanned by other devices
    const fetchIp = async () => {
      try {
        const response = await axios.get(`http://${window.location.hostname}:5000/api/ip`);
        if (response.data.ip) {
          setLocalIp(response.data.ip);
        }
      } catch (err) {
        console.error("Could not fetch local IP, falling back to hostname");
      }
    };
    fetchIp();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!text && !image) {
      setError('Please provide a message or an image to hide.');
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append('text', text);
    formData.append('password', password);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await axios.post(`/api/message`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setCreatedId(response.data.id);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        setError('Image must be less than 10MB.');
        e.target.value = '';
        return;
      }
      setImage(file);
    }
  };

  const getBaseUrl = () => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return `http://${localIp}:5000`;
    }
    return window.location.origin;
  };

  const qrUrl = createdId ? `${getBaseUrl()}/view/${createdId}` : '';

  const downloadQR = () => {
    const svg = qrRef.current.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `secret-qr-${createdId}.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const shareQR = async () => {
    const fallbackShare = () => {
      navigator.clipboard.writeText(qrUrl).then(() => {
        alert('Link copied to clipboard!');
      }).catch(err => {
        alert('Failed to copy link. The URL is: ' + qrUrl);
      });
    };

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Secret Message',
          text: 'Click the link to view my secret message!',
          url: qrUrl
        });
      } catch (err) {
        console.error('Error sharing:', err);
        fallbackShare();
      }
    } else {
      fallbackShare();
    }
  };

  return (
    <div className="glass-card">
      {!createdId ? (
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="text">Secret Message (Optional)</label>
            <div style={{ position: 'relative' }}>
              <FileText size={20} style={{ position: 'absolute', top: 12, left: 12, color: '#94a3b8' }} />
              <textarea
                id="text"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Enter the secret message you want to hide..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Image (Optional, max 10MB)</label>
            <div className="file-upload-wrapper">
              <input type="file" accept="image/*" onChange={handleImageChange} />
              <div className="file-upload-btn">
                <ImageIcon size={20} />
                <span>{image ? image.name : 'Click to select an image'}</span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password (Optional)</label>
            <div style={{ position: 'relative' }}>
              <Lock size={20} style={{ position: 'absolute', top: 12, left: 12, color: '#94a3b8' }} />
              <input
                id="password"
                type="password"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Set a password to lock the message (optional)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <Lock className="loader" size={20} /> : <Send size={20} />}
            {loading ? 'Encrypting & Generating...' : 'Generate QR Code'}
          </button>
        </form>
      ) : (
        <div className="qr-container">
          <h3>Your Secret QR Code is Ready!</h3>
          <p style={{ color: '#94a3b8', textAlign: 'center' }}>
            Scan this QR code or share it. {password ? 'They will need your password to view the message.' : 'Anyone who scans it can view the message.'}
          </p>
          <div className="qr-code-wrapper" ref={qrRef} style={{ padding: '1rem', background: 'white', borderRadius: '8px', display: 'inline-block' }}>
            <QRCodeSVG value={qrUrl} size={256} level="H" includeMargin={true} />
          </div>
          <p style={{ color: '#3b82f6', marginTop: '0.5rem', fontSize: '0.85rem', wordBreak: 'break-all', padding: '0 1rem' }}>
            {qrUrl}
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', width: '100%', maxWidth: '400px' }}>
            <button className="btn-primary" style={{ flex: 1, padding: '0.75rem' }} onClick={downloadQR}>
              <Download size={20} /> Save Image
            </button>
            <button className="btn-primary" type="button" style={{ flex: 1, padding: '0.75rem', background: '#3b82f6' }} onClick={shareQR}>
              <Share2 size={20} /> Share / Copy
            </button>
          </div>

          <button 
            className="btn-primary" 
            style={{ width: '100%', maxWidth: '400px', padding: '0.75rem', marginTop: '1rem', background: 'transparent', border: '1px solid #3b82f6' }}
            onClick={() => {
              setCreatedId(null);
              setText('');
              setPassword('');
              setImage(null);
            }}
          >
            Create Another
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateMessage;
