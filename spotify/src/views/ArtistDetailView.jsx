import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SpotifyService from '../services/SpotifyService';
import AlbumCard from '../components/AlbumCard/AlbumCard';
import '../styles/ArtistDetailView.css';

function ArtistDetailView() {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        const credentials = JSON.parse(localStorage.getItem('spotifyCredentials'));
        const artistData = await SpotifyService.getArtist(id, credentials.token);
        const albumsData = await SpotifyService.getArtistAlbums(id, credentials.token);
        
        setArtist(artistData);
        setAlbums(albumsData);
        setError('');
      } catch (err) {
        setError('Error al cargar la información del artista');
      }
    };

    fetchArtistData();
  }, [id]);

  if (error) return <div className="error-message">{error}</div>;
  if (!artist) return <div className="loading">Cargando...</div>;

  return (
    <div className="detail-container">
      {/* Eliminar la línea: <Navigation /> */}
      <div className="artist-header">
        <img 
          className="artist-image"
          src={artist.images[0]?.url || 'https://via.placeholder.com/200'} 
          alt={artist.name} 
        />
        <h1 className="artist-name">{artist.name}</h1>
      </div>

      <h2 className="albums-title">Álbumes</h2>
      <div className="albums-grid">
        {albums.map((album, index) => (
          <div key={album.id} style={{"--i": index + 1}}>
            <AlbumCard album={album} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ArtistDetailView;