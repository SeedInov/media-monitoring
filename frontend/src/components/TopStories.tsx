import { useState, useCallback, useMemo, useEffect } from 'react';
import { Calendar, ExternalLink, EyeIcon, Globe, LucideEye, MessageCircleMore, Search, Users } from 'lucide-react';
import SentimentBadge from './SentimentBadge';
import { formatDistanceToNow } from 'date-fns';
import NewsService from '../services/news.service';
import { fetchAllArticlesAPIResponse } from '../types/news';
import { useInView } from 'react-intersection-observer';
import TopStoriesSkeleton from './skeletons/TopStoriesSkeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';




const fallbackImage = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167';

const TopStories = () => {
  const { useFetchAllNews } = NewsService();
  const { data: newsData, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } = useFetchAllNews();

  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  console.log(hasNextPage, "has next page")

  const allNews = useMemo(() => {
    if (!newsData) return [];
    return newsData.pages.flatMap((news) => news);
  }, [newsData]) as fetchAllArticlesAPIResponse;

  console.log(allNews, "all news")
  console.log(newsData, "news")



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
          className={`w-full h-full object-cover transition-opacity duration-300 ${loadedImages[imageUrl] ? 'opacity-100' : 'opacity-0'
            }`}
          loading="lazy"
          onError={() => handleImageError(imageUrl)}
          onLoad={() => handleImageLoad(imageUrl)}
        />
      </div>
    );
  }, [loadedImages, handleImageError, handleImageLoad]);


  if (isLoading) {
    return <TopStoriesSkeleton />
  }

  if (allNews.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto mt-8">
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <Search className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">No Results Found</h3>
          <p className="text-gray-600 mb-4">
            We couldn't find any news articles at the moment. Please try again later.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 flex items-center">
        Top stories
        <ExternalLink className="h-4 w-4 ml-2 text-gray-400" />
      </h2>

      <div className="grid gap-6">
        {allNews.map((article, index) => (
          <div
            key={index}
            className={`bg-white rounded-lg overflow-hidden ${index === 0 ? 'shadow-md' : ''}`}
          >
            {index === 0 ? (
              <div className="flex flex-col">
                {renderImage(article.top_image || fallbackImage, 'h-64 w-full')}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{article.authors?.[0] || 'Unknown Author'}</span>
                    </div>
                    <div className='flex gap-2 items-center'>
                      <Dialog>
                        <DialogTrigger><MessageCircleMore/></DialogTrigger>
                        <DialogContent className="max-w-3xl h-[80vh]">
                          <DialogHeader>
                            <DialogTitle>{article?.title}</DialogTitle>
                            <DialogDescription>{article?.source} - {article?.date}</DialogDescription>
                          </DialogHeader>
                          <ScrollArea className="h-full pr-4">
                            <div className="space-y-4">
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>{article?.date}</span>
                                <Globe className="h-4 w-4 ml-4" />
                                <a href={article?.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                  {article?.source}
                                </a>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Users className="h-4 w-4" />
                                <span>{article?.authors.join(', ')}</span>
                              </div>
                              <div className="flex flex-wrap gap-2 mb-4">
                                {article?.keywords.map((keyword, kidx) => (
                                  <Badge key={kidx} variant="secondary">{keyword}</Badge>
                                ))}
                              </div>
                              <p className="text-lg font-semibold">Summary</p>
                              <p>{article?.summary}</p>
                              <p className="text-lg font-semibold mt-4">Full Text</p>
                              <p className="whitespace-pre-line">{article?.text}</p>
                            </div>
                          </ScrollArea>
                        </DialogContent>
                      </Dialog>
                      <SentimentBadge sentiment={getSentiment(article.title + article.summary)} />
                    </div>
                  </div>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 transition-colors"
                  >
                    <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                  </a>
                  <p>{article.summary}</p>
                  <p className="text-sm text-gray-500">
                    {article.publish_date ?
                      formatDistanceToNow(new Date(article.publish_date), { addSuffix: true }) :
                      'Recently'
                    }
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center p-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="truncate">{article.authors?.[0] || 'Unknown Author'}</span>
                    </div>

                    <div className='flex gap-2 items-center'>
                      <Dialog>
                        <DialogTrigger><MessageCircleMore/></DialogTrigger>
                        <DialogContent className="max-w-3xl h-[80vh]">
                          <DialogHeader>
                            <DialogTitle>{article?.title}</DialogTitle>
                            <DialogDescription>{article?.source} - {article?.date}</DialogDescription>
                          </DialogHeader>
                          <ScrollArea className="h-full pr-4">
                            <div className="space-y-4">
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>{article?.date}</span>
                                <Globe className="h-4 w-4 ml-4" />
                                <a href={article?.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                  {article?.source}
                                </a>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Users className="h-4 w-4" />
                                <span>{article?.authors.join(', ')}</span>
                              </div>
                              <div className="flex flex-wrap gap-2 mb-4">
                                {article?.keywords.map((keyword, kidx) => (
                                  <Badge key={kidx} variant="secondary">{keyword}</Badge>
                                ))}
                              </div>
                              <p className="text-lg font-semibold">Summary</p>
                              <p>{article?.summary}</p>
                              <p className="text-lg font-semibold mt-4">Full Text</p>
                              <p className="whitespace-pre-line">{article?.text}</p>
                            </div>
                          </ScrollArea>
                        </DialogContent>
                      </Dialog>
                      <SentimentBadge sentiment={getSentiment(article.title + article.summary)} />
                    </div>


                  </div>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 transition-colors"
                  >
                    <h3 className="font-medium mb-1 line-clamp-2">{article.title}</h3>
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
            )}
          </div>
        ))}
        <div ref={ref}></div>
        {isFetchingNextPage && [...Array(5)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg overflow-hidden">
            <div className="flex items-center p-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
                <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse mb-1"></div>
                <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-20 w-20 ml-4 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopStories;