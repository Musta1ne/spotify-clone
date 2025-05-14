import axios from 'axios';

class SpotifyService {
  constructor() {
    this.baseUrl = 'https://api.spotify.com/v1';
    this.tokenUrl = 'https://accounts.spotify.com/api/token';
    this.clientId = '8edcbca575ea4db79c5467d20c38e492';
    this.clientSecret = 'd3cd51a7e00f4a9ca698be9f1a57c072';
    this.token = null;
    this.tokenExpiration = null;
  }
  async initialize() {
    try {
      if (this.token && this.tokenExpiration && Date.now() < this.tokenExpiration) {
        return true;
      }

      const formData = new URLSearchParams();
      formData.append('grant_type', 'client_credentials');
      formData.append('client_id', this.clientId);
      formData.append('client_secret', this.clientSecret);
      
      const response = await axios.post(this.tokenUrl, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        withCredentials: false
      });
      
      if (response.data && response.data.access_token) {
        this.token = response.data.access_token;
        this.tokenExpiration = Date.now() + (response.data.expires_in - 60) * 1000;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Auth Error:', error.response?.data || error.message);
      await this.handleTokenError();
      return false;
    }
  }

  async handleTokenError() {
    this.token = null;
    this.tokenExpiration = null;
    // Retry initialization after a short delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return this.initialize();
  }

  async makeApiRequest(url, params = {}) {
    if (!this.token) {
      const initialized = await this.initialize();
      if (!initialized) return null;
    }

    try {
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Accept': 'application/json'
        },
        params,
        withCredentials: false
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        // Token expired, retry once
        this.token = null;
        const initialized = await this.initialize();
        if (initialized) {
          return this.makeApiRequest(url, params);
        }
      }
      console.error('API Request Error:', error.response?.data || error.message);
      return null;
    }
  }

  async getArtist(artistId) {
    const data = await this.makeApiRequest(`${this.baseUrl}/artists/${artistId}`);
    return data;
  }

  async getArtistAlbums(artistId) {
    const data = await this.makeApiRequest(`${this.baseUrl}/artists/${artistId}/albums`, {
      limit: 50,
      market: 'ES'  // Add market parameter
    });
    return data?.items || [];
  }

  async getAlbumTracks(albumId) {
    const data = await this.makeApiRequest(`${this.baseUrl}/albums/${albumId}/tracks`, {
      limit: 50,
      market: 'ES'  // Add market parameter
    });
    return data?.items || [];
  }

  async getAlbumDetails(albumId) {
    const data = await this.makeApiRequest(`${this.baseUrl}/albums/${albumId}`, {
      market: 'ES'  // Add market parameter
    });
    return data;
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