import { useState, useEffect } from 'react';
import SpotifyService from '../services/SpotifyService';
import ArtistCard from '../components/ArtistCard/ArtistCard';
import { IoSearch, IoClose } from 'react-icons/io5';
import '../styles/SearchView.css';

function SearchView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [artists, setArtists] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const searchArtists = async () => {
      if (searchTerm.trim()) {
        try {
          const credentials = JSON.parse(localStorage.getItem('spotifyCredentials'));
          const results = await SpotifyService.searchArtists(searchTerm, credentials.token);
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

  return (
    <div className="search-container">
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
            <IoClose size={18} />
          </button>
        )}
      </div>
      {error && <p className="error-message">{error}</p>}
      <div className="artists-grid">
        {artists.map(artist => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>
    </div>
  );
}

export default SearchView;