const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'mind-ease-server' });
});

// Routes
const authRoutes = require('./routes/auth');
const { ensureAdminSeed } = require('./db');
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${PORT}`);
  try {
    await ensureAdminSeed();
    // eslint-disable-next-line no-console
    console.log('Admin user ensured: admin@local / admin123');
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed to seed admin:', e.message);
  }
});


