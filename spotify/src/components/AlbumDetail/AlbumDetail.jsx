import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHeart } from 'react-icons/fa';
import './AlbumDetail.css';

const AlbumDetail = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [favoriteTracks, setFavoriteTracks] = useState(
    JSON.parse(localStorage.getItem('favoriteTracks')) || []
  );

  useEffect(() => {
    const fetchAlbumData = async () => {
      const response = await fetch(`https://api.spotify.com/v1/albums/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setAlbum(data);
    };

    fetchAlbumData();
  }, [id, token]);

  const toggleFavoriteTrack = (track) => {
    setFavoriteTracks(prev => {
      const isAlreadyFavorite = prev.some(t => t.id === track.id);
      const newFavorites = isAlreadyFavorite
        ? prev.filter(t => t.id !== track.id)
        : [...prev, { ...track, albumName: album.name, artistName: album.artists[0].name }];
      
      localStorage.setItem('favoriteTracks', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  if (!album) return <div className="loading">Cargando...</div>;

  return (
    <div className="album-detail">
      <div className="album-header">
        <button 
          className="back-button" 
          onClick={() => navigate(`/artist/${album.artists[0].id}`)}
        >
          <FaArrowLeft /> Volver al Artista
        </button>
      </div>

      <div className="album-info-detail">
        <img src={album.images[0]?.url} alt={album.name} />
        <div className="album-text">
          <h1>{album.name}</h1>
          <h2>{album.artists[0].name}</h2>
          <p>{new Date(album.release_date).getFullYear()} • {album.total_tracks} canciones</p>
        </div>
      </div>

      <div className="tracks-section">
        <div className="tracks-list">
          {album.tracks.items.map(track => {
            const isFavorite = favoriteTracks.some(t => t.id === track.id);
            return (
              <div key={track.id} className="track-item">
                <div className="track-info">
                  <span className="track-name">{track.name}</span>
                  <span className="track-duration">
                    {Math.floor(track.duration_ms / 60000)}:
                    {((track.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0')}
                  </span>
                </div>
                <button 
                  className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                  onClick={() => toggleFavoriteTrack(track)}
                >
                  <FaHeart />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AlbumDetail;