import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CreateMessage from './components/CreateMessage';
import ViewMessage from './components/ViewMessage';

function App() {
  return (
    <div className="app-container">
      <header className="header">
        <h1>QR Steganography</h1>
        <p>Hide your secret messages behind a password-protected QR Code.</p>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<CreateMessage />} />
          <Route path="/view/:id" element={<ViewMessage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
