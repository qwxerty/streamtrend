import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { showToast } from '../toast';

function Contact() {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message) return showToast('Wypełnij pole wiadomości!', 'error');

    const lastMessageTime = localStorage.getItem('contact_time');
    if (lastMessageTime && Date.now() - lastMessageTime < 300000) {
      return showToast('Poczekaj chwilę przed wysłaniem kolejnej wiadomości!', 'error');
    }

    const { error } = await supabase.from('messages').insert([{ content: message }]);
    if (error) {
      console.error('Błąd wysyłania wiadomości:', error);
      showToast('Nie udało się wysłać wiadomości.', 'error');
    } else {
      setMessage('');
      localStorage.setItem('contact_time', Date.now());
      showToast('Wiadomość wysłana!');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-5xl font-extrabold mb-10 text-white animate-fadeIn">Kontakt</h1>
      <div className="card p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <textarea
            placeholder="Twoja wiadomość"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="input h-40"
          />
          <button type="submit" className="btn btn-primary w-full">Wyślij</button>
        </form>
      </div>
    </div>
  );
}

export default Contact;