import { useState } from 'react';
import RegulationsModal from './RegulationsModal';

function Footer() {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <footer className="bg-gray-800/50 backdrop-blur-md p-6 mt-auto">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <p className="text-gray-300">&copy; 2025 StreamTrend. Wszystkie prawa zastrzeżone.</p>
        <button
          onClick={() => setModalOpen(true)}
          className="text-gray-200 hover:text-white font-medium"
        >
          Regulamin
        </button>
        <RegulationsModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
      </div>
    </footer>
  );
}

export default Footer;