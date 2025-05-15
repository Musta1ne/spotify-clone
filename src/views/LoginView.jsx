import { useState } from 'react';
import '../styles/LoginView.css';

function LoginView({ onLogin }) {
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
      localStorage.setItem('spotifyCredentials', JSON.stringify({ 
        clientId, 
        clientSecret
      }));
      onLogin();
    } catch (err) {
      console.error('Error al guardar credenciales:', err);
      setError('Error al guardar las credenciales');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1 className="login-title">Spotify Clone</h1>
        <p className="login-subtitle">Ingresa tus credenciales de Spotify Developer</p>
        
        <div className="input-group">
          <label htmlFor="clientId">Client ID</label>
          <input
            id="clientId"
            className="login-input"
            type="text"
            placeholder="Ingresa tu Client ID"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="clientSecret">Client Secret</label>
          <input
            id="clientSecret"
            className="login-input"
            type="password"
            placeholder="Ingresa tu Client Secret"
            value={clientSecret}
            onChange={(e) => setClientSecret(e.target.value)}
          />
        </div>

        {error && <p className="error-message">{error}</p>}
        <button className="login-button" type="submit">
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
}

export default LoginView;