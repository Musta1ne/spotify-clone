import axios from 'axios';

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
    const credentials = JSON.parse(localStorage.getItem('spotifyCredentials'));
    if (!credentials) {
      throw new Error('No se encontraron credenciales');
    }
    
    const base64Credentials = btoa(`${credentials.clientId}:${credentials.clientSecret}`);
    
    try {
      const response = await axios.post(this.tokenUrl, 
        'grant_type=client_credentials',
        {
          headers: {
            'Authorization': `Basic ${base64Credentials}`,
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
    const token = await this.initializeToken();
    try {
      const response = await axios.get(`${this.baseUrl}/albums/${albumId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener álbum:', error.response?.data || error);
      throw new Error('Error al obtener información del álbum');
    }
  }
}

export default new SpotifyService();