import React from 'react';
import { Sentiment } from '../types/news';

interface SentimentBadgeProps {
  sentiment: Sentiment;
}

const sentimentColors = {
  positive: 'bg-green-100 text-green-800',
  negative: 'bg-red-100 text-red-800',
  neutral: 'bg-gray-100 text-gray-800',
};

const SentimentBadge: React.FC<SentimentBadgeProps> = ({ sentiment }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-medium ${sentimentColors[sentiment]}`}>
    {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
  </span>
);

export default SentimentBadge;