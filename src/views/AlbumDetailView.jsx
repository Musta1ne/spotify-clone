import './AlbumDetailView.css';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SpotifyService from '../services/SpotifyService';

const AlbumDetailView = () => {
    const { id } = useParams();
    const [album, setAlbum] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlbumDetails = async () => {
            try {
                const response = await SpotifyService.getAlbumById(id);
                setAlbum(response);
                setLoading(false);
            } catch (error) {
                console.error('Error al cargar los detalles del álbum:', error);
                setLoading(false);
            }
        };

        fetchAlbumDetails();
    }, [id]);

    if (loading) {
        return <div className="loading">Cargando...</div>;
    }

    if (!album) {
        return <div className="error">No se pudo cargar el álbum</div>;
    }

    return (
        <div className="album-detail">
            <div className="album-header">
                <img src={album.images[0]?.url} alt={album.name} className="album-cover" />
                <div className="album-info">
                    <h1>{album.name}</h1>
                    <h2>{album.artists[0]?.name}</h2>
                </div>
            </div>
            
            <div className="tracks-list">
                <h3>Canciones</h3>
                <ul>
                    {album.tracks.items.map((track, index) => (
                        <li key={track.id} className="track-item">
                            <span className="track-number">{index + 1}</span>
                            <span className="track-name">{track.name}</span>
                            <span className="track-duration">
                                {Math.floor(track.duration_ms / 60000)}:
                                {String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AlbumDetailView;