import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './db';
import { register, login } from './controllers/authController';
import { authenticate } from './middlewares/auth';
import { createGame, guessWord, guessTitle, abandonGame, getGame, getHistory, getLeaderboard } from './controllers/gameController';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Auth routes
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);

// Game routes (public)
app.get('/api/games/history', getHistory);
app.get('/api/games/leaderboard', getLeaderboard);

// Game routes (protected)
app.post('/api/games', authenticate, createGame);
app.get('/api/games/:id', authenticate, getGame); // Also public? Requirements say all users can view past games. So let's make it public but returning masked if playing.
app.post('/api/games/:id/word', authenticate, guessWord);
app.post('/api/games/:id/title', authenticate, guessTitle);
app.post('/api/games/:id/abandon', authenticate, abandonGame);

const PORT = process.env.PORT || 3000;

sequelize.sync({ force: false }).then(() => {
  console.log('Database synced');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => console.error(err));
