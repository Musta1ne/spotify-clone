import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaMusic } from 'react-icons/fa';
import './FavoriteTracks.css';

const FavoriteTracks = () => {
  const navigate = useNavigate();
  const favoriteTracks = JSON.parse(localStorage.getItem('favoriteTracks')) || [];

  return (
    <div className="favorite-tracks">
      <div className="favorite-tracks-header">
        <button className="back-button" onClick={() => navigate('/')}>
          <FaArrowLeft /> Volver
        </button>
        <h1>Mis Canciones Favoritas</h1>
      </div>

      {favoriteTracks.length === 0 ? (
        <div className="no-favorites">
          <FaMusic className="music-icon" />
          <p>No tienes canciones favoritas aún</p>
        </div>
      ) : (
        <div className="tracks-container">
          {favoriteTracks.map(track => (
            <div 
              key={track.id} 
              className="favorite-track-item"
              onClick={() => navigate(`/album/${track.album_id}`)}
            >
              <div className="track-main-info">
                <span className="track-title">{track.name}</span>
                <div className="track-details">
                  <span className="artist-name">{track.artistName}</span>
                  <span className="separator">•</span>
                  <span className="album-name">{track.albumName}</span>
                </div>
              </div>
              <span className="track-duration">
                {Math.floor(track.duration_ms / 60000)}:
                {((track.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoriteTracks;