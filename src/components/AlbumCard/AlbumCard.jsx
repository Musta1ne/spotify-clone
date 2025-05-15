import { useNavigate } from 'react-router-dom';
import './AlbumCard.css';

function AlbumCard({ album }) {
  const navigate = useNavigate();
  const imageUrl = album.images[0]?.url || 'https://via.placeholder.com/200';

  const handleClick = () => {
    navigate(`/album/${album.id}`);
  };

  return (
    <div className="album-card" onClick={handleClick}>
      <img className="album-image" src={imageUrl} alt={album.name} />
      <h3 className="album-name">{album.name}</h3>
    </div>
  );
}

export default AlbumCard;