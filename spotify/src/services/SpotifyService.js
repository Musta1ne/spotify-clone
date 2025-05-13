import axios from 'axios';

class SpotifyService {
  constructor() {
    this.baseUrl = 'https://api.spotify.com/v1';
    this.tokenUrl = 'https://accounts.spotify.com/api/token';
    this.clientId = '8edcbca575ea4db79c5467d20c38e492';
    this.clientSecret = 'd3cd51a7e00f4a9ca698be9f1a57c072';
    this.token = null;
  }

  async initialize() {
    try {
      const formData = new URLSearchParams();
      formData.append('grant_type', 'client_credentials');
      formData.append('client_id', this.clientId);
      formData.append('client_secret', this.clientSecret);
      
      const response = await axios.post(this.tokenUrl, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      this.token = response.data.access_token;
      return true;
    } catch (error) {
      console.error('Auth Error:', error);
      return false;
    }
  }

  async searchArtists(query) {
    if (!this.token) {
      await this.initialize();
    }

    try {
      const response = await axios.get(`${this.baseUrl}/search`, {
        headers: { 'Authorization': `Bearer ${this.token}` },
        params: {
          q: query,
          type: 'artist',
          limit: 20
        }
      });
      return response.data.artists?.items || [];
    } catch (error) {
      console.error('Search error:', error);
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