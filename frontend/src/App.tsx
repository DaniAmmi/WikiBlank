import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { useState, useEffect } from 'react';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState(localStorage.getItem('username'));

  useEffect(() => {
    const handleAuth = () => {
      setToken(localStorage.getItem('token'));
      setUsername(localStorage.getItem('username'));
    };
    window.addEventListener('auth-change', handleAuth);
    return () => window.removeEventListener('auth-change', handleAuth);
  }, []);

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    setUsername(localStorage.getItem('username'));
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.dispatchEvent(new Event('auth-change'));
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex flex-col">
      <header className="bg-slate-800 border-b border-slate-700 shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-teal-400 hover:text-teal-300 transition-colors">
            <BookOpen className="w-8 h-8" />
            <span>WikiBlank</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/history" className="hover:text-teal-400 transition-colors">Cronologia</Link>
            <Link to="/leaderboard" className="hover:text-teal-400 transition-colors">Classifica</Link>
            {token ? (
              <div className="flex items-center gap-4">
                <span className="text-slate-400">Ciao, {username}</span>
                <button onClick={handleLogout} className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors">Esci</button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="hover:text-teal-400 transition-colors">Accedi</Link>
                <Link to="/register" className="bg-teal-500 hover:bg-teal-400 text-slate-900 px-4 py-2 rounded-lg font-semibold transition-colors">Registrati</Link>
              </div>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-grow max-w-6xl w-full mx-auto p-4 flex flex-col">
        <Outlet />
      </main>
      <footer className="bg-slate-800 border-t border-slate-700 py-6 text-center text-slate-500">
        <p>&copy; {new Date().getFullYear()} WikiBlank. Federico II University Project.</p>
      </footer>
    </div>
  );
}

export default App;
