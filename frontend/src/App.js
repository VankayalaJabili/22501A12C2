import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Urlshortener from './components/Urlshortener';
import StatsPage from './components/StatsPage';
import RedirectHandler from './components/RedirectHandler';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Urlshortener />} />
      <Route path="/stats" element={<StatsPage />} />
      <Route path="/:shortcode" element={<RedirectHandler />} />
    </Routes>
  );
}

export default App;
