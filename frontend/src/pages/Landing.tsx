import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Landing = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const startNewGame = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const res = await axios.post('http://localhost:3000/api/games', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate(`/game/${res.data.id}`);
    } catch (err) {
      alert('Error starting game');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-grow py-12">
      <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 mb-6 text-center">
        Benvenuto su WikiBlank
      </h1>
      <p className="text-xl text-slate-300 max-w-2xl text-center mb-10 leading-relaxed">
        Un gioco di deduzione basato su Wikipedia. Scegliamo un articolo casuale e oscuriamo tutte le parole. Il tuo obiettivo è indovinare le parole per svelare il testo e, infine, indovinare il titolo dell'articolo!
      </p>

      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl max-w-3xl w-full mb-10 border border-slate-700">
        <h2 className="text-2xl font-bold text-teal-400 mb-4">Come Giocare</h2>
        <ul className="list-disc list-inside space-y-3 text-slate-300 text-lg">
          <li>Avvia una nuova partita per ottenere un articolo di Wikipedia censurato.</li>
          <li>Digita le parole nella casella di testo. I tentativi corretti sveleranno tutte le occorrenze nel testo.</li>
          <li>In qualsiasi momento, se riconosci l'articolo, puoi indovinare direttamente il titolo!</li>
          <li>Se indovini il titolo correttamente, hai vinto! Più sei veloce, migliore sarà la tua posizione in classifica.</li>
          <li>Puoi abbandonare la partita se rimani bloccato.</li>
          <li>Le partite vengono salvate automaticamente. Puoi riprenderle in qualsiasi momento dalla pagina Cronologia.</li>
        </ul>
      </div>

      <button 
        onClick={startNewGame}
        className="px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-white font-bold rounded-full text-xl shadow-lg hover:shadow-teal-500/50 transition-all transform hover:-translate-y-1"
      >
        {token ? 'Nuova Partita' : 'Accedi per Giocare'}
      </button>
    </div>
  );
};
