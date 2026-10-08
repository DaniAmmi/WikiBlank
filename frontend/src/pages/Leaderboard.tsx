import { useState, useEffect } from 'react';
import axios from 'axios';

export const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/games/leaderboard');
        setLeaderboard(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="py-8 max-w-4xl mx-auto w-full">
      <h1 className="text-4xl font-bold text-teal-400 mb-8 text-center">Classifica Globale</h1>
      <div className="bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-700">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/50 text-slate-300">
              <th className="p-4 border-b border-slate-700 text-center w-16">Posizione</th>
              <th className="p-4 border-b border-slate-700">Giocatore</th>
              <th className="p-4 border-b border-slate-700">Vittorie</th>
              <th className="p-4 border-b border-slate-700">Tempo Medio (s)</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user, idx) => (
              <tr key={user.username} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                <td className="p-4 text-center font-bold text-slate-400">#{idx + 1}</td>
                <td className="p-4 font-semibold text-teal-300 text-lg">{user.username}</td>
                <td className="p-4 text-blue-300 font-medium">{user.wins}</td>
                <td className="p-4">{Math.round(user.avgTime)}</td>
              </tr>
            ))}
            {leaderboard.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">Nessun dato ancora disponibile.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
