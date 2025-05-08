import { useState } from 'react';
import SpotifyService from '../services/SpotifyService';
import '../styles/LoginView.css';

function LoginView({ setIsAuthenticated }) {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!clientId.trim() || !clientSecret.trim()) {
      setError('Por favor, completa todos los campos');
      return;
    }

    try {
      const token = await SpotifyService.getAccessToken(clientId, clientSecret);
      if (!token) {
        throw new Error('No se pudo obtener el token');
      }
      localStorage.setItem('spotifyCredentials', JSON.stringify({ 
        clientId, 
        clientSecret, 
        token,
        timestamp: Date.now() 
      }));
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Error de login:', err);
      setError(err.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1 className="login-title">Spotify Clone</h1>
        <input
          className="login-input"
          type="text"
          placeholder="Client ID"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
        />
        <input
          className="login-input"
          type="password"
          placeholder="Client Secret"
          value={clientSecret}
          onChange={(e) => setClientSecret(e.target.value)}
        />
        {error && <p className="error-message">{error}</p>}
        <button className="login-button" type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
}

export default LoginView;