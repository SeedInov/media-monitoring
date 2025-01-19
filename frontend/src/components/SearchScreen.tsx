import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TrendingTags from './TrendingTags';

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/results/${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-2xl px-4">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
          Media Monitoring
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Discover insights from news across the globe
        </p>

        <form onSubmit={handleSubmit} className="relative mb-8">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for news topics..."
            className="w-full px-6 py-4 text-lg rounded-full border-2 border-gray-200 
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                     transition-all duration-300 pr-12
                     placeholder:text-gray-400"
          />
          <button
            type="submit"
            className="absolute right-4 top-1/2 -translate-y-1/2 
                     text-gray-400 hover:text-blue-500 transition-colors duration-200"
          >
            <Search className="h-6 w-6" />
          </button>
        </form>

        <TrendingTags />
      </div>
      
      {/* Abstract background pattern */}
      <div className="fixed inset-0 -z-10 overflow-hidden opacity-5">
        <div className="absolute inset-0 transform -skew-y-12">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-64 w-full transform -skew-y-12"
              style={{
                backgroundColor: `rgba(59, 130, 246, ${0.1 + i * 0.02})`,
                transform: `translateY(${i * 4}rem)`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchScreen;