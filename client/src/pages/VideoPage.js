import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import VideoPlayer from '../components/VideoPlayer';
import CommentSection from '../components/CommentSection';

function VideoPage() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [selectedEpisode, setSelectedEpisode] = useState(null);

  useEffect(() => {
    fetchVideo();
  }, [id]);

  const fetchVideo = async () => {
    const { data: videoData, error: videoError } = await supabase.from('videos').select().eq('id', id).single();
    if (videoError) {
      console.error('Błąd pobierania wideo:', videoError);
      return;
    }
    setVideo(videoData);
    if (videoData.type === 'series') {
      const { data: episodeData, error: episodeError } = await supabase
        .from('episodes')
        .select()
        .eq('video_id', id)
        .order('season, episode');
      if (episodeError) {
        console.error('Błąd pobierania odcinków:', episodeError);
      } else {
        setEpisodes(episodeData || []);
        setSelectedEpisode(episodeData[0] || null);
      }
    }
    updateHistory(videoData);
  };

  const updateHistory = (video) => {
    const history = JSON.parse(localStorage.getItem('watchHistory') || '[]');
    const updatedHistory = [
      video,
      ...history.filter((v) => v.id !== video.id)
    ].slice(0, 5);
    localStorage.setItem('watchHistory', JSON.stringify(updatedHistory));
  };

  const handleEpisodeChange = (episode) => {
    setSelectedEpisode(episode);
  };

  if (!video) return <div className="p-6 text-center text-2xl text-white">Ładowanie...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-5xl font-bold mb-8 text-white animate-fadeIn">{video.title}</h1>
      {video.type === 'series' && episodes.length > 0 && (
        <div className="mb-8 animate-fadeIn">
          <h2 className="text-2xl font-semibold text-white mb-4">Wybierz odcinek</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {episodes.map((episode) => (
              <button
                key={`${episode.season}-${episode.episode}`}
                onClick={() => handleEpisodeChange(episode)}
                className={`card p-4 text-left ${selectedEpisode?.id === episode.id ? 'border-purple-500' : 'border-gray-700'}`}
              >
                <p className="text-lg font-semibold text-white">Sezon {episode.season}, Odcinek {episode.episode}</p>
                <p className="text-gray-300">{episode.title}</p>
              </button>
            ))}
          </div>
        </div>
      )}
      <VideoPlayer url={video.type === 'series' && selectedEpisode ? selectedEpisode.url : video.url} />
      <CommentSection videoId={id} />
    </div>
  );
}

export default VideoPage;