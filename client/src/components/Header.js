import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ThemeToggle from './ThemeToggle';
import logo from '../assets/logo.png';

function Header() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <header className="bg-gradient-to-r from-purple-900/90 to-cyan-900/90 backdrop-blur-md p-4 sticky top-0 z-30 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3">
          <img src={logo} alt="StreamTrend" className="h-12" />
          <span className="text-white text-3xl font-extrabold tracking-tight">StreamTrend</span>
        </Link>
        <nav className="flex space-x-8 items-center">
          <Link to="/" className="text-gray-200 hover:text-white text-lg font-medium">Strona główna</Link>
          <Link to="/contact" className="text-gray-200 hover:text-white text-lg font-medium">Kontakt</Link>
          <Link to="/admin" className="text-gray-200 hover:text-white text-lg font-medium">Admin</Link>
          <ThemeToggle />
          {supabase.auth.getSession().data?.session && (
            <button onClick={handleLogout} className="btn btn-danger text-sm">Wyloguj</button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;