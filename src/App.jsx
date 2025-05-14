import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SearchView from './views/SearchView';
import ArtistDetailView from './views/ArtistDetailView';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SearchView />} />
          <Route path="/search" element={<SearchView />} />
          <Route path="/artist/:id" element={<ArtistDetailView />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;