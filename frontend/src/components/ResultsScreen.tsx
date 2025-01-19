import { useParams } from 'react-router-dom';
import Header from './Header';
import FilterBar from './FilterBar';
import TopStories from './TopStories';
import PicksForYou from './PicksForYou';
import MentionsCard from './MentionsCard';
import TopSourcesCard from './TopSourcesCard';
import { fetchAllArticlesAPIResponse } from '../types/news';
import NewsService from '../services/news.service';
import { useMemo } from 'react';

const ResultsScreen = () => {
  const { query } = useParams();

  const { useFetchAllNews } = NewsService();
  const { data: newsData,isLoading} = useFetchAllNews();


  const allNews = useMemo(() => {
    if (!newsData) return [];
    return newsData.pages.flatMap((news) => news);
  }, [newsData]) as fetchAllArticlesAPIResponse;
  

  return (
    <div className="min-h-screen bg-gray-100">
      <Header initialQuery={query} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="col-span-2">
            <MentionsCard />
          </div>
          <div>
            <TopSourcesCard />
          </div>
        </div>

        <FilterBar />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <TopStories />
          </div>
          <div className="lg:col-span-1">
            <PicksForYou isLoading={isLoading} articles={allNews} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResultsScreen;