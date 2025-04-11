import toast from 'react-hot-toast';

export const showToast = (message, type = 'success') => {
  toast[type](message, {
    duration: 3000,
    style: {
      background: type === 'success' ? '#10B981' : '#EF4444',
      color: '#fff',
      borderRadius: '12px',
      padding: '16px',
    },
  });
};