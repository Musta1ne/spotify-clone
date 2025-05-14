import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoSearch, IoClose } from 'react-icons/io5';
import SpotifyService from '../services/SpotifyService';
import ArtistCard from '../components/ArtistCard/ArtistCard';
import '../styles/SearchView.css';

function SearchView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [artists, setArtists] = useState([]);
  const [favoriteArtists, setFavoriteArtists] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Cargar artistas favoritos
  useEffect(() => {
    const loadFavorites = () => {
      const favorites = JSON.parse(localStorage.getItem('favoriteArtists') || '[]');
      setFavoriteArtists(favorites);
    };

    loadFavorites();
    // Agregar un event listener para actualizar los favoritos cuando cambien
    window.addEventListener('storage', loadFavorites);
    return () => window.removeEventListener('storage', loadFavorites);
  }, []);

  useEffect(() => {
    const searchArtists = async () => {
      if (searchTerm.trim()) {
        try {
          const results = await SpotifyService.searchArtists(searchTerm);
          setArtists(results);
          setError('');
        } catch (err) {
          setError('Error al buscar artistas');
          setArtists([]);
        }
      } else {
        setArtists([]);
      }
    };

    const timeoutId = setTimeout(searchArtists, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleArtistClick = (artistId) => {
    navigate(`/artist/${artistId}`);
  };

  return (
    <div className="search-container">
      <div className="main-content">
        <div className="search-wrapper">
          <IoSearch className="search-icon" />
          <input
            className="search-input"
            type="text"
            placeholder="Buscar artistas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-button" onClick={() => setSearchTerm('')}>
              <IoClose />
            </button>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}
        
        <div className="artists-grid">
          {artists.map(artist => (
            <ArtistCard 
              key={artist.id} 
              artist={artist}
              onClick={() => handleArtistClick(artist.id)}
            />
          ))}
        </div>
      </div>

      {favoriteArtists.length > 0 && (
        <div className="favorites-sidebar">
          <h2>Artistas Favoritos</h2>
          <div className="favorites-list">
            {favoriteArtists.map(artist => (
              <ArtistCard 
                key={artist.id} 
                artist={artist}
                onClick={() => handleArtistClick(artist.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchView;