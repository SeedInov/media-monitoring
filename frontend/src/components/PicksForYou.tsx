import React, { useState, useCallback } from 'react';
import { Info } from 'lucide-react';
import SentimentBadge from './SentimentBadge';
import { formatDistanceToNow } from 'date-fns';
import { fetchAllArticlesAPIResponse } from '../types/news';



interface PicksForYouProps {
  articles: fetchAllArticlesAPIResponse;
  isLoading:boolean;
}

const fallbackImage = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167';

const PicksForYou: React.FC<PicksForYouProps> = ({ articles = [],isLoading }) => {
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  const handleImageError = useCallback((imageUrl: string) => {
    setLoadedImages(prev => ({
      ...prev,
      [imageUrl]: false
    }));
  }, []);

  const handleImageLoad = useCallback((imageUrl: string) => {
    setLoadedImages(prev => ({
      ...prev,
      [imageUrl]: true
    }));
  }, []);

  const getSentiment = useCallback((text: string): 'positive' | 'negative' | 'neutral' => {
    const positiveWords = ['hope', 'positive', 'growth', 'success', 'improve'];
    const negativeWords = ['risk', 'danger', 'crisis', 'trouble', 'conflict'];
    
    const lowerText = text.toLowerCase();
    const isPositive = positiveWords.some(word => lowerText.includes(word));
    const isNegative = negativeWords.some(word => lowerText.includes(word));
    
    return isPositive ? 'positive' : isNegative ? 'negative' : 'neutral';
  }, []);

  const renderImage = useCallback((imageUrl: string, className: string) => {
    const actualImage = loadedImages[imageUrl] === false ? fallbackImage : imageUrl;
    
    return (
      <div className={`${className} bg-gray-100 relative overflow-hidden`}>
        {!loadedImages[imageUrl] && (
          <div className="absolute inset-0 animate-pulse bg-gray-200" />
        )}
        <img
          src={actualImage}
          alt=""
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            loadedImages[imageUrl] ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          onError={() => handleImageError(imageUrl)}
          onLoad={() => handleImageLoad(imageUrl)}
        />
      </div>
    );
  }, [loadedImages, handleImageError, handleImageLoad]);

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Picks for you</h2>
          <Info className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      
      <div className="divide-y">
      {isLoading&&[...Array(3)].map((_, index) => (
          <div key={index} className="p-4 flex items-start">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
              </div>
              <div className="h-5 w-full bg-gray-200 rounded mb-2"></div>
              <div className="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
            </div>
            <div className="h-20 w-20 ml-4 rounded-lg bg-gray-200 flex-shrink-0"></div>
          </div>
        ))}
        {!isLoading&&articles.slice(0, 3).map((article) => (
          <div key={article.id} className="p-4 flex items-start hover:bg-gray-50 transition-colors">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center text-sm text-gray-500">
                  <span className="truncate">{article.authors?.[0] || 'Unknown Author'}</span>
                </div>
                <SentimentBadge sentiment={getSentiment(article.title + article.summary)} />
              </div>
              <a 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group"
              >
                <h3 className="font-medium mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {article.title}
                </h3>
              </a>
              <p className="text-sm text-gray-500">
                {article.publish_date ? 
                  formatDistanceToNow(new Date(article.publish_date), { addSuffix: true }) : 
                  'Recently'
                }
              </p>
            </div>
            {renderImage(article.top_image || fallbackImage, 'h-20 w-20 ml-4 rounded-lg flex-shrink-0')}
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(PicksForYou);