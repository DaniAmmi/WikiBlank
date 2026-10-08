import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Game = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState<any>(null);
  const [guess, setGuess] = useState('');
  const [titleGuess, setTitleGuess] = useState('');
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchGame();
  }, [id]);

  const fetchGame = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/games/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setGame(res.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to load game');
      }
    }
  };

  const handleWordGuess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guess.trim()) return;
    try {
      const res = await axios.post(`http://localhost:3000/api/games/${id}/word`, { word: guess }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGame(res.data);
      setGuess('');
    } catch (err) {
      setError('Error guessing word');
    }
  };

  const handleTitleGuess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleGuess.trim()) return;
    try {
      const res = await axios.post(`http://localhost:3000/api/games/${id}/title`, { title: titleGuess }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGame(res.data);
      setTitleGuess('');
    } catch (err) {
      setError('Error guessing title');
    }
  };

  const handleAbandon = async () => {
    try {
      const res = await axios.post(`http://localhost:3000/api/games/${id}/abandon`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGame(res.data);
    } catch (err) {
      setError('Error abandoning game');
    }
  };

  if (!game) return <div className="text-center py-20 text-2xl">Caricamento...</div>;

  const renderText = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((paragraph, i) => (
      <p key={i} className="mb-4 leading-relaxed tracking-wide text-lg">
        {paragraph}
      </p>
    ));
  };

  return (
    <div className="flex flex-col flex-grow py-8">
      {error && <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4">{error}</div>}
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-teal-400 mb-2">
            {game.status === 'won' ? 'Hai Vinto!' : game.status === 'abandoned' ? 'Partita Abbandonata' : 'Titolo: ' + game.maskedTitle}
          </h1>
          <p className="text-slate-400 text-lg">Tentativi: {game.guesses}</p>
        </div>
        {game.status === 'playing' && (
          <button onClick={handleAbandon} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-6 py-2 rounded-lg border border-red-500/50 transition-colors">
            Abbandona
          </button>
        )}
      </div>

      {game.status === 'playing' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <form onSubmit={handleWordGuess} className="flex gap-4">
            <input 
              type="text" 
              placeholder="Indovina una parola..." 
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              className="flex-grow bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 text-white"
            />
            <button type="submit" className="bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold px-6 py-3 rounded-lg transition-colors">
              Prova
            </button>
          </form>
          <form onSubmit={handleTitleGuess} className="flex gap-4">
            <input 
              type="text" 
              placeholder="Indovina il titolo!" 
              value={titleGuess}
              onChange={(e) => setTitleGuess(e.target.value)}
              className="flex-grow bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-lg transition-colors">
              Risolvi
            </button>
          </form>
        </div>
      )}

      {(game.status === 'won' || game.status === 'abandoned') && (
        <div className="mb-10 text-center">
          <h2 className="text-2xl mb-4">L'articolo era: <span className="font-bold text-teal-300">{game.title || game.articleTitle}</span></h2>
          <button onClick={() => navigate('/')} className="bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold px-8 py-3 rounded-full transition-colors">
            Gioca Ancora
          </button>
        </div>
      )}

      <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl prose prose-invert max-w-none break-words whitespace-pre-wrap font-serif text-slate-300">
        {renderText(game.text || game.maskedText)}
      </div>
    </div>
  );
};
