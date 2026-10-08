import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export const History = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/games/history');
        setHistory(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold text-teal-400 mb-8 text-center">Cronologia Partite</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800 text-slate-300">
              <th className="p-4 border-b border-slate-700">Giocatore</th>
              <th className="p-4 border-b border-slate-700">Titolo Articolo</th>
              <th className="p-4 border-b border-slate-700">Stato</th>
              <th className="p-4 border-b border-slate-700">Tentativi</th>
              <th className="p-4 border-b border-slate-700">Tempo Impiegato (s)</th>
              <th className="p-4 border-b border-slate-700">Azione</th>
            </tr>
          </thead>
          <tbody>
            {history.map((game) => (
              <tr key={game.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                <td className="p-4">{game.username}</td>
                <td className="p-4 font-semibold text-teal-300">{game.title}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${game.status === 'won' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {game.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-4">{game.guesses}</td>
                <td className="p-4">{Math.round(game.timeSpent)}</td>
                <td className="p-4">
                  <Link to={`/game/${game.id}`} className="text-blue-400 hover:text-blue-300 underline">Vedi</Link>
                </td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">Nessuna partita conclusa finora.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
