const express = require('express');
const { supabase } = require('../supabaseClient');
const router = express.Router();

router.get('/:videoId', async (req, res) => {
  const { videoId } = req.params;
  const { data, error } = await supabase.from('comments').select().eq('video_id', videoId);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/', async (req, res) => {
  const { username, content, video_id, parent_id } = req.body;
  if (!username || !content || !video_id) return res.status(400).json({ error: 'Wypełnij wszystkie pola' });
  const { data, error } = await supabase
    .from('comments')
    .insert([{ username, content, video_id, parent_id, upvotes: 0, downvotes: 0 }])
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('comments').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Komentarz usunięty' });
});

module.exports = router;