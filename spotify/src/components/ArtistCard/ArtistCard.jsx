import { Link } from 'react-router-dom';
import './ArtistCard.css';

function ArtistCard({ artist }) {
  if (!artist) {
    return null;
  }

  const imageUrl = artist?.images?.[0]?.url || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
  
  return (
    <Link to={`/artist/${artist.id}`} className="artist-card">
      <img 
        className="artist-image" 
        src={imageUrl} 
        alt={artist?.name || 'Artist'} 
      />
      <h3 className="artist-name">{artist?.name || 'Unknown Artist'}</h3>
    </Link>
  );
}

export default ArtistCard;