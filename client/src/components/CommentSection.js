import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { showToast } from '../toast';

function CommentSection({ videoId }) {
  const [username, setUsername] = useState('');
  const [content, setContent] = useState('');
  const [comments, setComments] = useState([]);
  const [accepted, setAccepted] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select()
      .eq('video_id', videoId)
      .order('created_at', { ascending: false });
    if (error) console.error('Błąd pobierania komentarzy:', error);
    else setComments(data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !content) return showToast('Wypełnij wszystkie pola!', 'error');
    if (!accepted) return showToast('Zaakceptuj regulamin!', 'error');

    const lastCommentTime = localStorage.getItem(`comment_time_${videoId}`);
    if (lastCommentTime && Date.now() - lastCommentTime < 60000) {
      return showToast('Poczekaj chwilę przed dodaniem kolejnego komentarza!', 'error');
    }

    const { data, error } = await supabase
      .from('comments')
      .insert([{ username, content, video_id: videoId, upvotes: 0, downvotes: 0, parent_id: null }])
      .select();
    if (error) {
      console.error('Błąd dodawania komentarza:', error);
      showToast('Nie udało się dodać komentarza.', 'error');
    } else {
      setComments([data[0], ...comments]);
      setUsername('');
      setContent('');
      setAccepted(false);
      localStorage.setItem(`comment_time_${videoId}`, Date.now());
      showToast('Komentarz dodany pomyślnie!');
    }
  };

  const handleReplySubmit = async (e, parentId) => {
    e.preventDefault();
    if (!username || !replyContent) return showToast('Wypełnij wszystkie pola!', 'error');

    const lastCommentTime = localStorage.getItem(`comment_time_${videoId}`);
    if (lastCommentTime && Date.now() - lastCommentTime < 60000) {
      return showToast('Poczekaj chwilę przed dodaniem kolejnego komentarza!', 'error');
    }

    const { data, error } = await supabase
      .from('comments')
      .insert([{ username, content: replyContent, video_id: videoId, upvotes: 0, downvotes: 0, parent_id: parentId }])
      .select();
    if (error) {
      console.error('Błąd dodawania odpowiedzi:', error);
      showToast('Nie udało się dodać odpowiedzi.', 'error');
    } else {
      setComments([data[0], ...comments]);
      setReplyContent('');
      setReplyTo(null);
      localStorage.setItem(`comment_time_${videoId}`, Date.now());
      showToast('Odpowiedź dodana pomyślnie!');
    }
  };

  const handleVote = async (id, type) => {
    const voteKey = `vote_${videoId}_${id}`;
    const currentVote = localStorage.getItem(voteKey);

    if (currentVote === type) return;

    const comment = comments.find((c) => c.id === id);
    let update = {};
    if (currentVote) {
      update = type === 'up'
        ? { upvotes: comment.upvotes + 1, downvotes: comment.downvotes - 1 }
        : { upvotes: comment.upvotes - 1, downvotes: comment.downvotes + 1 };
    } else {
      update = type === 'up' ? { upvotes: comment.upvotes + 1 } : { downvotes: comment.downvotes + 1 };
    }

    const { error } = await supabase.from('comments').update(update).eq('id', id);
    if (error) {
      console.error('Błąd głosowania:', error);
      showToast('Nie udało się zagłosować.', 'error');
    } else {
      localStorage.setItem(voteKey, type);
      fetchComments();
    }
  };

  const renderComment = (comment, depth = 0) => (
    <div key={comment.id} className={`mt-4 ${depth > 0 ? 'ml-8 border-l-2 border-purple-500/50 pl-4' : ''}`}>
      <div className="card p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="font-semibold text-lg text-white">{comment.username}</p>
            <p className="text-gray-300 mt-1">{comment.content}</p>
            <p className="text-xs text-gray-400 mt-2">
              {new Date(comment.created_at).toLocaleString('pl-PL')}
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => handleVote(comment.id, 'up')}
              className={`flex items-center ${localStorage.getItem(`vote_${videoId}_${comment.id}`) === 'up' ? 'text-green-400' : 'text-gray-400 hover:text-green-400'}`}
            >
              👍 {comment.upvotes}
            </button>
            <button
              onClick={() => handleVote(comment.id, 'down')}
              className={`flex items-center ${localStorage.getItem(`vote_${videoId}_${comment.id}`) === 'down' ? 'text-red-400' : 'text-gray-400 hover:text-red-400'}`}
            >
              👎 {comment.downvotes}
            </button>
          </div>
        </div>
        <button
          onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
          className="text-purple-400 hover:text-purple-300 text-sm mt-2"
        >
          {replyTo === comment.id ? 'Anuluj' : 'Odpowiedz'}
        </button>
        {replyTo === comment.id && (
          <form onSubmit={(e) => handleReplySubmit(e, comment.id)} className="mt-4">
            <textarea
              placeholder="Twoja odpowiedź"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="input mb-4"
              rows="3"
            />
            <button type="submit" className="btn btn-primary">Wyślij odpowiedź</button>
          </form>
        )}
      </div>
      {comments
        .filter((c) => c.parent_id === comment.id)
        .map((reply) => renderComment(reply, depth + 1))}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto mt-12">
      <h3 className="text-3xl font-bold mb-6 text-white">Komentarze</h3>
      <form onSubmit={handleSubmit} className="card p-6 mb-8 animate-fadeIn">
        <input
          type="text"
          placeholder="Nazwa użytkownika"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input mb-4"
        />
        <textarea
          placeholder="Twój komentarz"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="input mb-4"
          rows="4"
        />
        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="h-5 w-5 text-purple-500 rounded"
          />
          <span className="ml-2 text-sm text-gray-300">Akceptuję regulamin</span>
        </label>
        <button type="submit" className="btn btn-primary">Dodaj komentarz</button>
      </form>
      <div className="space-y-4">
        {comments.filter((c) => !c.parent_id).map((comment) => renderComment(comment))}
      </div>
    </div>
  );
}

export default CommentSection;