import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const FloatingHomeButton = () => {
  return (
    <Link
      to="/dashboard"
      className="fixed bottom-8 right-8 p-4 bg-white/80 hover:bg-white shadow-lg hover:shadow-xl 
        rounded-full transform hover:scale-110 transition-all duration-300 backdrop-blur-sm
        group z-50"
    >
      <Home className="w-6 h-6 text-gray-700 group-hover:text-green-600 transition-colors" />
      <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg bg-white/90 
        text-gray-700 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap
        pointer-events-none shadow-md">
        Kembali ke Home
      </span>
    </Link>
  );
};

export default FloatingHomeButton;

