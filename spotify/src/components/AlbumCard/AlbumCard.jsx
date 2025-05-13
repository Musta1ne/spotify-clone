import { Link } from 'react-router-dom';
import './AlbumCard.css';

function AlbumCard({ album }) {
  const imageUrl = album.images?.[0]?.url || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

  return (
    <Link to={`/album/${album.id}`} className="album-card">
      <img src={imageUrl} alt={album.name} className="album-image" />
      <h3 className="album-name">{album.name}</h3>
      <p className="album-artist">{album.artists?.[0]?.name}</p>
    </Link>
  );
}

export default AlbumCard;