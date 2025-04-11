import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function Home() {
  const [videos, setVideos] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchVideos();
    const savedHistory = JSON.parse(localStorage.getItem('watchHistory') || '[]');
    setHistory(savedHistory);
  }, []);

  const fetchVideos = async () => {
    const { data, error } = await supabase.from('videos').select();
    if (error) console.error('Błąd pobierania wideo:', error);
    else setVideos(data || []);
  };

  const series = videos.filter((v) => v.type === 'series');
  const movies = videos.filter((v) => v.type === 'movie');

  return (
    <div className="max-w-7xl mx-auto p-6">
      {history.length > 0 && (
        <>
          <h2 className="text-4xl font-bold mb-8 text-white">Ostatnio oglądane</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 animate-fadeIn">
            {history.map((video) => (
              <Link to={`/video/${video.id}`} key={video.id} className="card group">
                <div className="relative overflow-hidden rounded-t-2xl">
                  <div className="h-52 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <span className="text-gray-400 text-sm">Brak miniatury</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-white truncate">{video.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
      <h2 className="text-4xl font-bold mb-8 text-white">Seriale</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 animate-fadeIn">
        {series.map((video) => (
          <Link to={`/video/${video.id}`} key={video.id} className="card group">
            <div className="relative overflow-hidden rounded-t-2xl">
              <div className="h-52 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <span className="text-gray-400 text-sm">Brak miniatury</span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-white truncate">{video.title}</h3>
            </div>
          </Link>
        ))}
      </div>
      <h2 className="text-4xl font-bold mb-8 text-white">Filmy</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn">
        {movies.map((video) => (
          <Link to={`/video/${video.id}`} key={video.id} className="card group">
            <div className="relative overflow-hidden rounded-t-2xl">
              <div className="h-52 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <span className="text-gray-400 text-sm">Brak miniatury</span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-white truncate">{video.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;