import React from 'react';
import { ExternalLink } from 'lucide-react';

interface NewsCardProps {
  title: string;
  source: string;
  date: string;
  snippet: string;
  imageUrl: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

const NewsCard: React.FC<NewsCardProps> = ({
  title,
  source,
  date,
  snippet,
  imageUrl,
  sentiment,
}) => {
  const sentimentColors = {
    positive: 'bg-green-100 text-green-800',
    negative: 'bg-red-100 text-red-800',
    neutral: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex">
      <div className="w-48 h-48 flex-shrink-0">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6 flex-1">
        <div className="flex items-start justify-between">
          <div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${sentimentColors[sentiment]}`}>
              {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
            </span>
            <p className="text-sm text-gray-500 mt-2">
              {source} • {date}
            </p>
          </div>
          <ExternalLink className="h-5 w-5 text-gray-400 hover:text-blue-500 cursor-pointer" />
        </div>
        <h3 className="text-xl font-semibold mt-2">{title}</h3>
        <p className="text-gray-600 mt-2 line-clamp-2">{snippet}</p>
      </div>
    </div>
  );
};

export default NewsCard;