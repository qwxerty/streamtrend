import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { showToast } from '../toast';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Błąd logowania:', error);
      showToast('Nieprawidłowy email lub hasło.', 'error');
    } else {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', data.user.id)
        .single();
      if (profile?.is_admin) {
        showToast('Zalogowano pomyślnie!');
        navigate('/admin');
      } else {
        await supabase.auth.signOut();
        showToast('Brak uprawnień admina.', 'error');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-white">Logowanie Admina</h1>
      <div className="card p-8 animate-fadeIn">
        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
          <input
            type="password"
            placeholder="Hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
          <button type="submit" className="btn btn-primary w-full">Zaloguj się</button>
        </form>
      </div>
    </div>
  );
}

export default Login;