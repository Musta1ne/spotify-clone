import axios from 'axios';
import spotifyConfig from '../config/spotify.config';

class SpotifyService {
  constructor() {
    this.baseUrl = 'https://api.spotify.com/v1';
    this.tokenUrl = 'https://accounts.spotify.com/api/token';
    this.token = null;
  }

  async initializeToken() {
    if (!this.token) {
      this.token = await this.getAccessToken();
    }
    return this.token;
  }

  async getAccessToken() {
    const credentials = btoa(`${spotifyConfig.clientId}:${spotifyConfig.clientSecret}`);
    
    try {
      const response = await axios.post(this.tokenUrl, 
        'grant_type=client_credentials',
        {
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      return response.data.access_token;
    } catch (error) {
      console.error('Error de autenticación:', error.response?.data || error);
      throw new Error('Error al obtener el token de acceso');
    }
  }

  async searchArtists(query) {
    const token = await this.initializeToken();
    try {
      const response = await axios.get(`${this.baseUrl}/search`, {
        headers: { 'Authorization': `Bearer ${token}` },
        params: {
          q: query,
          type: 'artist',
          limit: 20
        }
      });
      return response.data.artists.items;
    } catch (error) {
      throw new Error('Error al buscar artistas');
    }
  }

  async getArtist(artistId) {
    const token = await this.initializeToken();
    try {
      const response = await axios.get(`${this.baseUrl}/artists/${artistId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener información del artista');
    }
  }

  async getArtistAlbums(artistId) {
    const token = await this.initializeToken();
    try {
      const response = await axios.get(`${this.baseUrl}/artists/${artistId}/albums`, {
        headers: { 'Authorization': `Bearer ${token}` },
        params: {
          limit: 50
        }
      });
      return response.data.items;
    } catch (error) {
      throw new Error('Error al obtener álbumes del artista');
    }
  }

  async getAlbumById(albumId) {
      const token = await this.getAccessToken();
      const response = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });
      return response.data;
  }
}

export default new SpotifyService();