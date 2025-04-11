import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { showToast } from '../toast';

function Admin() {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState('movie');
  const [videos, setVideos] = useState([]);
  const [regulations, setRegulations] = useState('');
  const [comments, setComments] = useState([]);
  const [editVideo, setEditVideo] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [newEpisode, setNewEpisode] = useState({ season: '', episode: '', title: '', url: '' });
  const navigate = useNavigate();

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      navigate('/login');
      return;
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', session.session.user.id)
      .single();
    if (!profile?.is_admin) {
      await supabase.auth.signOut();
      navigate('/login');
      showToast('Brak uprawnień admina.', 'error');
    } else {
      fetchVideos();
      fetchRegulations();
      fetchComments();
    }
  };

  const fetchVideos = async () => {
    const { data, error } = await supabase.from('videos').select();
    if (error) console.error('Błąd pobierania wideo:', error);
    else setVideos(data || []);
  };

  const fetchRegulations = async () => {
    const { data, error } = await supabase.from('regulations').select().single();
    if (error) console.error('Błąd pobierania regulaminu:', error);
    else setRegulations(data?.content || '');
  };

  const fetchComments = async () => {
    const { data, error } = await supabase.from('comments').select();
    if (error) console.error('Błąd pobierania komentarzy:', error);
    else setComments(data || []);
  };

  const fetchEpisodes = async (videoId) => {
    const { data, error } = await supabase.from('episodes').select().eq('video_id', videoId);
    if (error) console.error('Błąd pobierania odcinków:', error);
    else setEpisodes(data || []);
  };

  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    if (!title || !url) return showToast('Wypełnij wszystkie pola!', 'error');
    if (editVideo) {
      const { error } = await supabase.from('videos').update({ title, url, type }).eq('id', editVideo.id);
      if (error) {
        console.error('Błąd edycji wideo:', error);
        showToast('Nie udało się edytować wideo.', 'error');
      } else {
        showToast('Wideo zaktualizowane pomyślnie!');
        setEditVideo(null);
      }
    } else {
      const { error } = await supabase.from('videos').insert([{ title, url, type }]);
      if (error) {
        console.error('Błąd dodawania wideo:', error);
        showToast('Nie udało się dodać wideo.', 'error');
      } else {
        showToast('Wideo dodane pomyślnie!');
      }
    }
    setTitle('');
    setUrl('');
    setType('movie');
    fetchVideos();
  };

  const handleEpisodeSubmit = async (e) => {
    e.preventDefault();
    if (!newEpisode.season || !newEpisode.episode || !newEpisode.title || !newEpisode.url || !editVideo) {
      return showToast('Wypełnij wszystkie pola odcinka!', 'error');
    }
    const { error } = await supabase.from('episodes').insert([{
      video_id: editVideo.id,
      season: parseInt(newEpisode.season),
      episode: parseInt(newEpisode.episode),
      title: newEpisode.title,
      url: newEpisode.url
    }]);
    if (error) {
      console.error('Błąd dodawania odcinka:', error);
      showToast('Nie udało się dodać odcinka.', 'error');
    } else {
      showToast('Odcinek dodany pomyślnie!');
      setNewEpisode({ season: '', episode: '', title: '', url: '' });
      fetchEpisodes(editVideo.id);
    }
  };

  const handleRegulationsSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('regulations').upsert([{ id: 1, content: regulations }]);
    if (error) {
      console.error('Błąd aktualizacji regulaminu:', error);
      showToast('Nie udało się zaktualizować regulaminu.', 'error');
    } else {
      showToast('Regulamin zaktualizowany pomyślnie!');
    }
  };

  const deleteVideo = async (id) => {
    if (!window.confirm('Czy na pewno usunąć wideo?')) return;
    const { error } = await supabase.from('videos').delete().eq('id', id);
    if (error) {
      console.error('Błąd usuwania wideo:', error);
      showToast('Nie udało się usunąć wideo.', 'error');
    } else {
      showToast('Wideo usunięte pomyślnie!');
      fetchVideos();
    }
  };

  const deleteComment = async (id) => {
    if (!window.confirm('Czy na pewno usunąć komentarz?')) return;
    const { error } = await supabase.from('comments').delete().eq('id', id);
    if (error) {
      console.error('Błąd usuwania komentarza:', error);
      showToast('Nie udało się usunąć komentarza.', 'error');
    } else {
      showToast('Komentarz usunięty pomyślnie!');
      fetchComments();
    }
  };

  const deleteEpisode = async (id) => {
    if (!window.confirm('Czy na pewno usunąć odcinek?')) return;
    const { error } = await supabase.from('episodes').delete().eq('id', id);
    if (error) {
      console.error('Błąd usuwania odcinka:', error);
      showToast('Nie udało się usunąć odcinka.', 'error');
    } else {
      showToast('Odcinek usunięty pomyślnie!');
      fetchEpisodes(editVideo.id);
    }
  };

  const startEdit = (video) => {
    setEditVideo(video);
    setTitle(video.title);
    setUrl(video.url);
    setType(video.type);
    if (video.type === 'series') {
      fetchEpisodes(video.id);
    } else {
      setEpisodes([]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-5xl font-bold mb-10 text-white animate-fadeIn">Panel Admina</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-8">
          <h2 className="text-3xl font-semibold mb-6 text-white">{editVideo ? 'Edytuj wideo' : 'Dodaj wideo'}</h2>
          <form onSubmit={handleVideoSubmit} className="space-y-6">
            <input
              type="text"
              placeholder="Tytuł"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
            />
            <input
              type="text"
              placeholder="URL wideo (np. https://www.youtube.com/embed/xyz)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="input"
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="input"
            >
              <option value="movie">Film</option>
              <option value="series">Serial</option>
            </select>
            <div className="flex space-x-4">
              <button type="submit" className="btn btn-primary flex-1">
                {editVideo ? 'Zapisz zmiany' : 'Dodaj wideo'}
              </button>
              {editVideo && (
                <button
                  type="button"
                  onClick={() => {
                    setEditVideo(null);
                    setTitle('');
                    setUrl('');
                    setType('movie');
                    setEpisodes([]);
                  }}
                  className="btn btn-danger flex-1"
                >
                  Anuluj
                </button>
              )}
            </div>
          </form>
          {editVideo?.type === 'series' && (
            <div className="mt-8">
              <h3 className="text-2xl font-semibold mb-4 text-white">Dodaj odcinek</h3>
              <form onSubmit={handleEpisodeSubmit} className="space-y-6">
                <input
                  type="number"
                  placeholder="Sezon"
                  value={newEpisode.season}
                  onChange={(e) => setNewEpisode({ ...newEpisode, season: e.target.value })}
                  className="input"
                  min="1"
                />
                <input
                  type="number"
                  placeholder="Odcinek"
                  value={newEpisode.episode}
                  onChange={(e) => setNewEpisode({ ...newEpisode, episode: e.target.value })}
                  className="input"
                  min="1"
                />
                <input
                  type="text"
                  placeholder="Tytuł odcinka"
                  value={newEpisode.title}
                  onChange={(e) => setNewEpisode({ ...newEpisode, title: e.target.value })}
                  className="input"
                />
                <input
                  type="text"
                  placeholder="URL odcinka"
                  value={newEpisode.url}
                  onChange={(e) => setNewEpisode({ ...newEpisode, url: e.target.value })}
                  className="input"
                />
                <button type="submit" className="btn btn-primary w-full">Dodaj odcinek</button>
              </form>
              <h3 className="text-2xl font-semibold mt-8 mb-4 text-white">Lista odcinków</h3>
              {episodes.length === 0 ? (
                <p className="text-gray-400">Brak odcinków.</p>
              ) : (
                episodes.map((episode) => (
                  <div key={episode.id} className="flex justify-between items-center py-3 border-b border-gray-700">
                    <span className="text-white">
                      Sezon {episode.season}, Odcinek {episode.episode}: {episode.title}
                    </span>
                    <button onClick={() => deleteEpisode(episode.id)} className="btn btn-danger">Usuń</button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        <div className="card p-8">
          <h2 className="text-3xl font-semibold mb-6 text-white">Edytuj regulamin</h2>
          <form onSubmit={handleRegulationsSubmit} className="space-y-6">
            <textarea
              placeholder="Treść regulaminu"
              value={regulations}
              onChange={(e) => setRegulations(e.target.value)}
              className="input"
              rows="8"
            />
            <button type="submit" className="btn btn-primary w-full">Zapisz regulamin</button>
          </form>
        </div>
      </div>
      <h2 className="text-4xl font-bold mt-16 mb-8 text-white">Zarządzaj wideo</h2>
      <div className="card p-8">
        {videos.length === 0 ? (
          <p className="text-gray-400">Brak wideo do wyświetlenia.</p>
        ) : (
          videos.map((video) => (
            <div key={video.id} className="flex justify-between items-center py-4 border-b border-gray-700">
              <span className="text-lg text-white">{video.title} ({video.type})</span>
              <div className="flex space-x-4">
                <button onClick={() => startEdit(video)} className="btn btn-primary">Edytuj</button>
                <button onClick={() => deleteVideo(video.id)} className="btn btn-danger">Usuń</button>
              </div>
            </div>
          ))
        )}
      </div>
      <h2 className="text-4xl font-bold mt-16 mb-8 text-white">Zarządzaj komentarzami</h2>
      <div className="card p-8">
        {comments.length === 0 ? (
          <p className="text-gray-400">Brak komentarzy do wyświetlenia.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex justify-between items-center py-4 border-b border-gray-700">
              <div className="flex-1">
                <p className="text-lg text-white"><strong>{comment.username}:</strong> {comment.content}</p>
                <p className="text-sm text-gray-400">Wideo ID: {comment.video_id} {comment.parent_id ? '(odpowiedź)' : ''}</p>
              </div>
              <button onClick={() => deleteComment(comment.id)} className="btn btn-danger">Usuń</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Admin;