
const TopSourcesCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-medium text-gray-700 mb-4">Top Sources</h2>
      <div className="space-y-3">
        {['BBC News', 'Reuters', 'Associated Press'].map((source) => (
          <div key={source} className="flex items-center justify-between">
            <span className="text-gray-600">{source}</span>
            <span className="text-sm text-gray-500">532 articles</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopSourcesCard;