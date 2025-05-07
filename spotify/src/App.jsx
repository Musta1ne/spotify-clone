import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaSearch, FaHeart, FaSpotify, FaMusic } from 'react-icons/fa';
import ArtistDetail from './components/ArtistDetail/ArtistDetail';
import AlbumDetail from './components/AlbumDetail/AlbumDetail';
import FavoriteTracks from './components/FavoriteTracks/FavoriteTracks';
import './App.css';
import { useCallback } from 'react';

function App() {
  const [token, setToken] = useState('');
  const [searchKey, setSearchKey] = useState('');
  const [artists, setArtists] = useState([]);
  const [favoriteArtists, setFavoriteArtists] = useState(
    JSON.parse(localStorage.getItem('favoriteArtists')) || []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const getToken = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `grant_type=client_credentials&client_id=${import.meta.env.VITE_SPOTIFY_CLIENT_ID}&client_secret=${import.meta.env.VITE_SPOTIFY_CLIENT_SECRET}`,
        });

        if (!response.ok) {
          throw new Error('Error al obtener el token');
        }

        const data = await response.json();
        setToken(data.access_token);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    getToken();
  }, []);

  const searchArtists = async (e) => {
    e.preventDefault();
    if (!searchKey.trim()) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${searchKey}&type=artist`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Error en la búsqueda');
      }

      const data = await response.json();
      setArtists(data.artists.items);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="loading">
        <FaSpotify className="loading-icon" /> Cargando...
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={() => window.location.reload()}>Reintentar</button>
      </div>
    );
  }

  const toggleFavorite = (artist) => {
    setFavoriteArtists(prev => {
      const isAlreadyFavorite = prev.some(fav => fav.id === artist.id);
      const newFavorites = isAlreadyFavorite
        ? prev.filter(fav => fav.id !== artist.id)
        : [...prev, artist];
      
      localStorage.setItem('favoriteArtists', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const Home = () => (
    <div className="app-container">
      <div className="spotify-app">
        <div className="header">
          <FaSpotify className="spotify-icon" />
          <h1>SPOTIFY APP</h1>
          <Link to="/favorites" className="favorites-link">
            <FaMusic /> Canciones Favoritas
          </Link>
        </div>
        
        <form onSubmit={searchArtists}>
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar artista..."
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
          </div>
        </form>

        <div className="content-container">
          <div className="search-results">
            <h2>RESULTADOS DE BÚSQUEDA</h2>
            <div className="artists-grid">
              {artists.map(artist => (
                <Link to={`/artist/${artist.id}`} key={artist.id} className="artist-card">
                  <img src={artist.images[0]?.url} alt={artist.name} />
                  <div className="artist-info">
                    <h3>{artist.name}</h3>
                    <button 
                      className={`favorite-btn ${favoriteArtists.some(fav => fav.id === artist.id) ? 'active' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(artist);
                      }}
                    >
                      <FaHeart />
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="favorites-sidebar">
            <h2>ARTISTAS FAVORITOS</h2>
            <div className="favorites-list">
              {favoriteArtists.map(artist => (
                <Link to={`/artist/${artist.id}`} key={artist.id} className="favorite-artist-card">
                  <img src={artist.images[0]?.url} alt={artist.name} />
                  <span>{artist.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/artist/:id" 
          element={
            <ArtistDetail 
              token={token} 
              toggleFavorite={toggleFavorite}
              favoriteArtists={favoriteArtists}
            />
          } 
        />
        <Route 
          path="/album/:id" 
          element={<AlbumDetail token={token} />} 
        />
        <Route path="/favorites" element={<FavoriteTracks />} />
      </Routes>
    </Router>
  );
}

export default App;
