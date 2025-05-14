import './AlbumCard.css';

function AlbumCard({ album }) {
  const releaseYear = new Date(album.release_date).getFullYear();
  const imageUrl = album.images[0]?.url || 'https://via.placeholder.com/300';

  return (
    <div className="album-card">
      <img className="album-image" src={imageUrl} alt={album.name} />
      <div className="album-info">
        <h3 className="album-name">{album.name}</h3>
        <p className="album-year">{releaseYear}</p>
      </div>
    </div>
  );
}

export default AlbumCard;