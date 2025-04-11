import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function RegulationsModal({ isOpen, onClose }) {
  const [regulations, setRegulations] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchRegulations();
    }
  }, [isOpen]);

  const fetchRegulations = async () => {
    const { data, error } = await supabase.from('regulations').select().single();
    if (error) console.error('Błąd pobierania regulaminu:', error);
    else setRegulations(data?.content || 'Brak regulaminu.');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="card max-w-2xl mx-4 animate-fadeIn">
        <h2 className="text-2xl font-bold mb-4 text-white">Regulamin</h2>
        <pre className="text-gray-200 whitespace-pre-wrap max-h-96 overflow-y-auto">{regulations}</pre>
        <button onClick={onClose} className="btn btn-primary mt-6 w-full">Zamknij</button>
      </div>
    </div>
  );
}

export default RegulationsModal;