import { Request, Response } from 'express';
import axios from 'axios';
import { Game } from '../models/Game';
import { User } from '../models/User';
import { AuthRequest } from '../middlewares/auth';
import { Op } from 'sequelize';

const maskText = (text: string, revealedWords: string[]) => {
  const wordsToReveal = new Set(revealedWords.map(w => w.toLowerCase()));
  return text.replace(/[\p{L}\p{N}]+/gu, (word) => {
    if (wordsToReveal.has(word.toLowerCase())) {
      return word;
    }
    return '█'.repeat(word.length);
  });
};

export const createGame = async (req: AuthRequest, res: Response) => {
  try {
    let pageTitle = 'Roma';
    let pageExtract = 'Roma è la capitale della Repubblica Italiana, nonché capoluogo della città metropolitana omonima e della regione Lazio. Con i suoi oltre due milioni di abitanti, è il comune più popoloso d\'Italia e il terzo dell\'Unione europea dopo Berlino e Madrid.';

    try {
      const response = await axios.get('https://it.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=false&explaintext=true&generator=random&grnnamespace=0&grnlimit=1', {
        headers: { 'User-Agent': 'WikiBlankApp/1.0 (federico.ii@university.it)' },
        timeout: 5000
      });
      const pages = response.data?.query?.pages;
      if (pages) {
        const pageId = Object.keys(pages)[0];
        const page = pages[pageId];
        if (page && page.title && page.extract) {
          pageTitle = page.title;
          pageExtract = page.extract;
        }
      }
    } catch (err) {
      console.error('Wikipedia API error, using fallback article');
    }

    const game = await Game.create({
      userId: req.userId!,
      articleTitle: pageTitle,
      articleText: pageExtract,
      revealedWords: [],
    });

    res.status(201).json({
      id: game.id,
      maskedTitle: maskText(game.articleTitle, []),
      maskedText: maskText(game.articleText, []),
      status: game.status,
      guesses: game.guesses,
      startTime: game.startTime,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const guessWord = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { word } = req.body;
    
    if (!word) {
      return res.status(400).json({ error: 'Word is required' });
    }

    const game = await Game.findOne({ where: { id, userId: req.userId } });
    if (!game) return res.status(404).json({ error: 'Game not found' });
    if (game.status !== 'playing') return res.status(400).json({ error: 'Game is over' });

    const lowerWord = word.toLowerCase().trim();
    let updatedRevealed = [...game.revealedWords];
    
    if (!updatedRevealed.includes(lowerWord)) {
      updatedRevealed.push(lowerWord);
    }

    game.revealedWords = updatedRevealed;
    game.guesses += 1;
    await game.save();

    res.json({
      id: game.id,
      maskedTitle: maskText(game.articleTitle, game.revealedWords),
      maskedText: maskText(game.articleText, game.revealedWords),
      status: game.status,
      guesses: game.guesses,
      revealedWords: game.revealedWords,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const guessTitle = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const game = await Game.findOne({ where: { id, userId: req.userId } });
    if (!game) return res.status(404).json({ error: 'Game not found' });
    if (game.status !== 'playing') return res.status(400).json({ error: 'Game is over' });

    game.guesses += 1;

    if (title.toLowerCase().trim() === game.articleTitle.toLowerCase().trim()) {
      game.status = 'won';
      game.endTime = new Date();
    }
    
    await game.save();

    res.json({
      id: game.id,
      title: game.status === 'won' ? game.articleTitle : maskText(game.articleTitle, game.revealedWords),
      text: game.status === 'won' ? game.articleText : maskText(game.articleText, game.revealedWords),
      status: game.status,
      guesses: game.guesses,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const abandonGame = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const game = await Game.findOne({ where: { id, userId: req.userId } });
    if (!game) return res.status(404).json({ error: 'Game not found' });
    if (game.status !== 'playing') return res.status(400).json({ error: 'Game is over' });

    game.status = 'abandoned';
    game.endTime = new Date();
    await game.save();

    res.json({
      id: game.id,
      title: game.articleTitle,
      text: game.articleText,
      status: game.status,
      guesses: game.guesses,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getGame = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const game = await Game.findByPk(id);
    if (!game) return res.status(404).json({ error: 'Game not found' });

    if (game.status !== 'playing') {
      return res.json({
        id: game.id,
        title: game.articleTitle,
        text: game.articleText,
        status: game.status,
        guesses: game.guesses,
        startTime: game.startTime,
        endTime: game.endTime,
      });
    }

    res.json({
      id: game.id,
      maskedTitle: maskText(game.articleTitle, game.revealedWords),
      maskedText: maskText(game.articleText, game.revealedWords),
      status: game.status,
      guesses: game.guesses,
      revealedWords: game.revealedWords,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getHistory = async (req: Request, res: Response) => {
  try {
    const games = await Game.findAll({
      where: {
        status: { [Op.ne]: 'playing' },
      },
      include: [{ model: User, attributes: ['username'] }],
      order: [['createdAt', 'DESC']],
      limit: 50,
    });
    
    res.json(games.map(g => ({
      id: g.id,
      title: g.articleTitle,
      username: (g as any).User.username,
      guesses: g.guesses,
      status: g.status,
      timeSpent: g.endTime ? (g.endTime.getTime() - g.startTime.getTime()) / 1000 : 0,
      createdAt: g.createdAt,
    })));
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    // "classifica basata sul tempo medio necessario a indovinare il titolo e sul numero di partite completate con successo"
    const games = await Game.findAll({
      where: { status: 'won' },
      include: [{ model: User, attributes: ['username'] }],
    });

    const stats: Record<string, { wins: number, totalTime: number }> = {};
    for (const g of games) {
      const username = (g as any).User.username;
      if (!stats[username]) stats[username] = { wins: 0, totalTime: 0 };
      stats[username].wins += 1;
      stats[username].totalTime += (g.endTime!.getTime() - g.startTime.getTime()) / 1000;
    }

    const leaderboard = Object.entries(stats).map(([username, s]) => ({
      username,
      wins: s.wins,
      avgTime: s.totalTime / s.wins,
    }));

    leaderboard.sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      return a.avgTime - b.avgTime;
    });

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
