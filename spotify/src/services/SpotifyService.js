import axios from 'axios';

class SpotifyService {
  constructor() {
    this.baseUrl = 'https://api.spotify.com/v1';
    this.tokenUrl = 'https://accounts.spotify.com/api/token';
    // Replace these with your new credentials from Spotify Developer Dashboard
    this.clientId = 'your_new_client_id';
    this.clientSecret = 'your_new_client_secret';
    this.token = null;
    this.tokenExpiration = null;
  }

  async initialize() {
    try {
      const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
      
      const response = await axios.post(this.tokenUrl, 'grant_type=client_credentials', {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      this.token = response.data.access_token;
      this.tokenExpiration = Date.now() + (response.data.expires_in - 60) * 1000;
      return true;
    } catch (error) {
      console.error('Auth Error Details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      return false;
    }
  }

  async searchArtists(query) {
    if (!this.token) {
      const initialized = await this.initialize();
      if (!initialized) {
        console.error('Failed to initialize token');
        return [];
      }
    }

    try {
      console.log('Searching for:', query); // Debug log
      const response = await axios.get(`${this.baseUrl}/search`, {
        headers: { 
          'Authorization': `Bearer ${this.token}`,
          'Accept': 'application/json'
        },
        params: {
          q: query,
          type: 'artist',
          limit: 20
        }
      });
      console.log('Search response:', response.data); // Debug log
      return response.data.artists?.items || [];
    } catch (error) {
      console.error('Search error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      return [];
    }
  }

  async getArtist(artistId) {
    if (!this.token) {
      await this.initialize();
    }

    try {
      const response = await axios.get(`${this.baseUrl}/artists/${artistId}`, {
        headers: { 'Authorization': `Bearer ${this.token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Artist error:', error);
      return null;
    }
  }

  async getArtistAlbums(artistId) {
    if (!this.token) {
      await this.initialize();
    }

    try {
      const response = await axios.get(`${this.baseUrl}/artists/${artistId}/albums`, {
        headers: { 'Authorization': `Bearer ${this.token}` },
        params: {
          limit: 50
        }
      });
      return response.data.items || [];
    } catch (error) {
      console.error('Albums error:', error);
      return [];
    }
  }

  async getAlbumTracks(albumId) {
    if (!this.token) {
      await this.initialize();
    }

    try {
      const response = await axios.get(`${this.baseUrl}/albums/${albumId}/tracks`, {
        headers: { 'Authorization': `Bearer ${this.token}` },
        params: {
          limit: 50
        }
      });
      return response.data.items || [];
    } catch (error) {
      console.error('Tracks error:', error);
      return [];
    }
  }

  async getAlbumDetails(albumId) {
    if (!this.token) {
      await this.initialize();
    }

    try {
      const response = await axios.get(`${this.baseUrl}/albums/${albumId}`, {
        headers: { 'Authorization': `Bearer ${this.token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Album details error:', error);
      return null;
    }
  }

  getFavoriteArtists() {
    const favorites = localStorage.getItem('favoriteArtists');
    return favorites ? JSON.parse(favorites) : [];
  }

  toggleFavoriteArtist(artist) {
    const favorites = this.getFavoriteArtists();
    const index = favorites.findIndex(fav => fav.id === artist.id);
    
    if (index === -1) {
      favorites.push(artist);
    } else {
      favorites.splice(index, 1);
    }
    
    localStorage.setItem('favoriteArtists', JSON.stringify(favorites));
    return favorites;
  }

  isFavoriteArtist(artistId) {
    const favorites = this.getFavoriteArtists();
    return favorites.some(artist => artist.id === artistId);
  }
}

export default new SpotifyService();