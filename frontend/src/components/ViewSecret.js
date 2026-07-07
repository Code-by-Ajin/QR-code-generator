import React, { useEffect, useState } from 'react';

function ViewSecret({ secretId }) {
  const [secret, setSecret] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!secretId) return;

    const fetchSecret = async () => {
      try {
        const response = await fetch(`/api/secrets/${secretId}`);
        if (!response.ok) {
          throw new Error('Unable to fetch secret');
        }
        const data = await response.json();
        setSecret(data);
      } catch (err) {
        setError(err.message || 'Network error');
      }
    };

    fetchSecret();
  }, [secretId]);

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!secret) {
    return <p>Loading secret...</p>;
  }

  return (
    <section style={{ marginTop: 24 }}>
      <h2>View Secret</h2>
      <p><strong>ID:</strong> {secret.id}</p>
      <p>{secret.text}</p>
    </section>
  );
}

export default ViewSecret;
