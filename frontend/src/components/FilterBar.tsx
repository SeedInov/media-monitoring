import React from 'react';
import { Calendar, Globe, Filter } from 'lucide-react';

const FilterBar = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex items-center space-x-4">
      <Filter className="h-5 w-5 text-gray-400" />
      <select className="px-3 py-2 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option>All Sentiments</option>
        <option>Positive</option>
        <option>Neutral</option>
        <option>Negative</option>
      </select>
      
      <div className="flex items-center space-x-2">
        <Globe className="h-5 w-5 text-gray-400" />
        <select className="px-3 py-2 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Countries</option>
          <option>United States</option>
          <option>United Kingdom</option>
          <option>India</option>
        </select>
      </div>
      
      <div className="flex items-center space-x-2">
        <Calendar className="h-5 w-5 text-gray-400" />
        <select className="px-3 py-2 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 3 months</option>
          <option>Custom range</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;