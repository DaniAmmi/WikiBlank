import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import { Landing } from './pages/Landing.tsx';
import { Game } from './pages/Game.tsx';
import { Leaderboard } from './pages/Leaderboard.tsx';
import { Login } from './pages/Login.tsx';
import { Register } from './pages/Register.tsx';
import { History } from './pages/History.tsx';
import './index.css';

export const MainRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Landing />} />
          <Route path="game/:id" element={<Game />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="history" element={<History />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
