import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHeart } from 'react-icons/fa';
import './ArtistDetail.css';

const ArtistDetail = ({ token, toggleFavorite, favoriteArtists }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artist, setArtist] = useState(null);
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const fetchArtistData = async () => {
      const [artistResponse, albumsResponse] = await Promise.all([
        fetch(`https://api.spotify.com/v1/artists/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`https://api.spotify.com/v1/artists/${id}/albums`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const artistData = await artistResponse.json();
      const albumsData = await albumsResponse.json();

      setArtist(artistData);
      setAlbums(albumsData.items);
    };

    fetchArtistData();
  }, [id, token]);

  if (!artist) return <div className="loading">Cargando...</div>;

  const isFavorite = favoriteArtists.some(fav => fav.id === artist.id);

  return (
    <div className="artist-detail">
      <div className="artist-header">
        <button className="back-button" onClick={() => navigate('/')}>
          <FaArrowLeft /> Volver
        </button>
        <button 
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={() => toggleFavorite(artist)}
        >
          <FaHeart />
        </button>
      </div>

      <div className="artist-info-detail">
        <img src={artist.images[0]?.url} alt={artist.name} />
        <h1>{artist.name}</h1>
        <p>Seguidores: {artist.followers.total.toLocaleString()}</p>
      </div>

      <div className="albums-section">
        <h2>Álbumes</h2>
        <div className="albums-grid">
          {albums.map(album => (
            <div 
              key={album.id} 
              className="album-card"
              onClick={() => navigate(`/album/${album.id}`)}
            >
              <img src={album.images[0]?.url} alt={album.name} />
              <div className="album-info">
                <h3>{album.name}</h3>
                <p>{new Date(album.release_date).getFullYear()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtistDetail;