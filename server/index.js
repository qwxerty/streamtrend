const express = require('express');
const cors = require('cors');
const videoRoutes = require('./routes/videos');
const commentRoutes = require('./routes/comments');
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/videos', videoRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serwer działa na porcie ${PORT}`));