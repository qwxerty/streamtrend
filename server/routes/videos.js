const express = require('express');
const { supabase } = require('../supabaseClient');
const router = express.Router();

router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('videos').select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/', async (req, res) => {
  const { title, url, type } = req.body;
  if (!title || !url || !type) return res.status(400).json({ error: 'Wypełnij wszystkie pola' });
  const { data, error } = await supabase.from('videos').insert([{ title, url, type }]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, url, type } = req.body;
  if (!title || !url || !type) return res.status(400).json({ error: 'Wypełnij wszystkie pola' });
  const { data, error } = await supabase.from('videos').update({ title, url, type }).eq('id', id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('videos').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Wideo usunięte' });
});

router.get('/episodes/:videoId', async (req, res) => {
  const { videoId } = req.params;
  const { data, error } = await supabase.from('episodes').select().eq('video_id', videoId);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/episodes', async (req, res) => {
  const { video_id, season, episode, title, url } = req.body;
  if (!video_id || !season || !episode || !title || !url) {
    return res.status(400).json({ error: 'Wypełnij wszystkie pola' });
  }
  const { data, error } = await supabase
    .from('episodes')
    .insert([{ video_id, season, episode, title, url }])
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.delete('/episodes/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('episodes').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Odcinek usunięty' });
});

module.exports = router;