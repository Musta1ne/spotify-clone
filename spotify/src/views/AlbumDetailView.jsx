import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import SpotifyService from '../services/SpotifyService';
import '../styles/AlbumDetailView.css';

function AlbumDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlbumData = async () => {
      try {
        setLoading(true);
        const albumData = await SpotifyService.getAlbumDetails(id);
        const tracksData = await SpotifyService.getAlbumTracks(id);
        setAlbum(albumData);
        setTracks(tracksData);
      } catch (err) {
        setError('Error al cargar el álbum');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumData();
  }, [id]);

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!album) return <div className="error">Álbum no encontrado</div>;

  return (
    <div className="album-detail-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        <IoArrowBack /> Volver
      </button>

      <div className="album-header">
        <img 
          src={album.images?.[0]?.url || SpotifyService.defaultImage} 
          alt={album.name}
          className="album-cover"
        />
        <div className="album-info">
          <h1>{album.name}</h1>
          <p className="album-artist">{album.artists?.map(artist => artist.name).join(', ')}</p>
          <p className="album-meta">
            {new Date(album.release_date).getFullYear()} • {tracks.length} canciones
          </p>
        </div>
      </div>

      <div className="tracks-list">
        {tracks.map((track, index) => (
          <div key={track.id} className="track-item">
            <span className="track-number">{index + 1}</span>
            <div className="track-info">
              <span className="track-name">{track.name}</span>
              <span className="track-duration">
                {Math.floor(track.duration_ms / 60000)}:
                {String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AlbumDetailView;