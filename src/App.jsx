import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SearchView from './views/SearchView';
import ArtistDetailView from './views/ArtistDetailView';
import AlbumDetailView from './views/AlbumDetailView';
import LoginView from './views/LoginView';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const credentials = localStorage.getItem('spotifyCredentials');
    if (credentials) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <div className="app-container">
      <BrowserRouter>
        <Routes>
          {!isAuthenticated ? (
            <>
              <Route path="/login" element={<LoginView onLogin={handleLogin} />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<SearchView />} />
              <Route path="/search" element={<SearchView />} />
              <Route path="/artist/:id" element={<ArtistDetailView />} />
              <Route path="/album/:id" element={<AlbumDetailView />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;