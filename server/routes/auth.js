const express = require('express');
const { supabase } = require('../supabaseClient');
const router = express.Router();

router.get('/check', async (req, res) => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) {
    return res.status(401).json({ error: 'Nie zalogowano' });
  }
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', session.session.user.id)
    .single();
  if (!profile?.is_admin) {
    return res.status(403).json({ error: 'Brak uprawnień admina' });
  }
  res.json({ user: session.session.user });
});

module.exports = router;