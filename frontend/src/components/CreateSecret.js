import React, { useState } from 'react';

function CreateSecret({ onCreated }) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!text.trim()) {
      setError('Please enter a secret message.');
      return;
    }

    try {
      const response = await fetch('/api/secrets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Unable to create secret');
      }

      const data = await response.json();
      onCreated(data.id);
      setText('');
    } catch (err) {
      setError(err.message || 'Network error');
    }
  };

  return (
    <section>
      <h2>Create Secret</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
        <textarea
          rows="5"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your secret message here"
          style={{ width: '100%', padding: 12, fontSize: 16 }}
        />
        <button type="submit" style={{ padding: '10px 14px', fontSize: 16 }}>
          Save Secret
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </section>
  );
}

export default CreateSecret;
