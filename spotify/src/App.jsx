import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LoginView from './views/LoginView';
import SearchView from './views/SearchView';
import ArtistDetailView from './views/ArtistDetailView';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const credentials = localStorage.getItem('spotifyCredentials');
    if (credentials) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <div className="app-container">
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={!isAuthenticated ? <LoginView setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/search" />} 
          />
          <Route 
            path="/search" 
            element={isAuthenticated ? <SearchView /> : <Navigate to="/" />} 
          />
          <Route 
            path="/artist/:id" 
            element={isAuthenticated ? <ArtistDetailView /> : <Navigate to="/" />} 
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;