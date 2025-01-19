import React from 'react';
import { TrendingUp } from 'lucide-react';

const MentionsCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-medium text-gray-700">Keyword Mentions</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">2,547</p>
          <p className="text-sm text-gray-500 mt-1">+15% from last week</p>
        </div>
        <div className="bg-blue-50 p-3 rounded-full">
          <TrendingUp className="h-6 w-6 text-blue-600" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-2 bg-gray-100 rounded-full">
          <div className="h-2 bg-blue-500 rounded-full" style={{ width: '75%' }}></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Last 7 days</span>
          <span>2,547 mentions</span>
        </div>
      </div>
    </div>
  );
};

export default MentionsCard;