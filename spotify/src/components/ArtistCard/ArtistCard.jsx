import { Link } from 'react-router-dom';
import './ArtistCard.css';

function ArtistCard({ artist }) {
  const imageUrl = artist.images[0]?.url || 'https://via.placeholder.com/200';
  
  return (
    <Link to={`/artist/${artist.id}`} className="artist-card">
      <img className="artist-image" src={imageUrl} alt={artist.name} />
      <h3 className="artist-name">{artist.name}</h3>
    </Link>
  );
}

export default ArtistCard;