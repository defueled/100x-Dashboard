import { Link } from 'react-router-dom';
import { Target, User } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="border-b border-white/10 bg-brand-black/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-brand-accent flex items-center justify-center text-brand-black font-bold">
              100x
            </div>
            <span className="font-semibold tracking-tight text-lg">LifeOS</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link 
              to="/dashboard" 
              className="text-sm font-medium text-brand-light/70 hover:text-brand-light transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              to="/dashboard" 
              className="flex items-center gap-2 bg-brand-gray hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-white/5"
            >
              <User size={16} />
              <span>Login</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
