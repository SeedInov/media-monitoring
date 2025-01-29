import React, { useState } from 'react';
import { BarChart2, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  initialQuery?: string;
}

const Header: React.FC<HeaderProps> = ({ initialQuery = '' }) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/results/${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <BarChart2 className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-semibold">Media Monitoring</h1>
          </div>
          <form onSubmit={handleSubmit} className="relative w-96">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news..."
              className="w-full px-4 py-2 rounded-full border focus:outline-none 
                       focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
            <button type="submit" className="absolute right-3 top-2.5">
              <Search className="h-5 w-5 text-gray-400" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Header;