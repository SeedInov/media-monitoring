import { useNavigate } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';

const tags = [
  { id: 1, name: 'AI', count: 2547 },
  { id: 2, name: 'Technology', count: 1823 },
  { id: 3, name: 'Economy', count: 1456 },
  { id: 4, name: 'Climate', count: 1234 },
  { id: 5, name: 'Healthcare', count: 987 },
];

const TrendingTags = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-2 text-gray-600 mb-4">
        <TrendingUp className="h-5 w-5" />
        <span className="font-medium">Trending Topics</span>
      </div>
      
      <div className="flex flex-wrap justify-center gap-3">
        {tags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => navigate(`/results/${tag.name}`)}
            className="px-4 py-2 rounded-full bg-white border border-gray-200 
                     hover:border-blue-500 hover:text-blue-600 
                     transition-all duration-200 group"
          >
            <span className="font-medium">#{tag.name}</span>
            <span className="ml-2 text-sm text-gray-400 group-hover:text-blue-400">
              {tag.count.toLocaleString()}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TrendingTags;