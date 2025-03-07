'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  Search,
  Calendar,
  Tag,
  Filter,
  Globe,
  Twitter,
  Download,
  ChevronDown,
  X,
  Plus,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import PageContainer from '@/components/layout/page-container';

// Types
interface Article {
  id: string;
  title: string;
  date: string;
  outlet: string;
  outletType: string;
  outletTier: number;
  region: string;
  country: string;
  language: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  estimatedAudience: number;
  publicityValue: number;
  author: string;
  summary: string;
  url: string;
  imageUrl: string;
  tags: string[];
  mediaType: string;
  followers?: number;
  impressions?: number;
  premium?: boolean;
  engagements?: number;
}

interface FilterState {
  dateRange: { from: Date | undefined; to: Date | undefined } | undefined;
  searchText: string;
  searchHeadlines: string;
  excludeTags: string[];
  tags: string[];
  sentiment: string[];
  mediaTypes: string[];
  outlets: string[];
  outletRegions: string[];
  outletCountries: string[];
  outletTiers: string[];
  userTiers: string[];
  verifiedUsers: boolean;
  criticalSearch: boolean;
  socialMediaTypes: string[];
  postTypes: string[];
  followers: string;
  impressions: string;
  premium: boolean;
  engagements: string;
  relevancyScore: string;
  relevancy: string;
}

// Mock data
const mockArticles: Article[] = [
  {
    id: '1',
    title:
      'Vitamins Market Size to Surpass USD 10.54 Billion by 2032 at a 6.64% CAGR, Fueled by Health Trends and Technological Innovations',
    date: '2025-01-21T06:57:00',
    outlet: 'SNS Insider',
    outletType: 'News',
    outletTier: 3,
    region: 'North America',
    country: 'United States',
    language: 'English',
    sentiment: 'positive',
    estimatedAudience: 505393,
    publicityValue: 3309,
    author: 'SNS Insider pvt ltd',
    summary:
      "on preventive healthcare, the rise of wellness trends, and the growing consumer preference for natural and organic products in these regions further strengthen Asia Pacific's market leadership.",
    url: 'https://example.com/article1',
    imageUrl: '/article.webp?height=200&width=200',
    tags: ['Health', 'Market', 'Vitamins'],
    mediaType: 'News'
  },
  {
    id: '2',
    title: 'Versprechen, Versprechen – Tesla Cybertruck Edition',
    date: '2023-08-15T21:17:00',
    outlet: 'Gettotext',
    outletType: 'Blog',
    outletTier: 3,
    region: 'Europe',
    country: 'United Kingdom',
    language: 'German',
    sentiment: 'neutral',
    estimatedAudience: 1768,
    publicityValue: 1491,
    author: 'Elon Musk',
    summary:
      'Oder folgen Sie uns auf Google News! Gibt es noch irgendjemanden auf der Welt, der Elon Musk auch nur ein Wort glaubt? Wenn ja, beantworten Sie diese Frage: Würden Sie ihm erlauben, Ihnen einen Computerchip ins Gehirn zu implantieren?',
    url: 'https://example.com/article2',
    imageUrl: '/article.webp?height=200&width=200',
    tags: ['Tesla', 'Elon Musk', 'Cybertruck'],
    mediaType: 'Blog'
  },
  {
    id: '3',
    title: 'Driving an electric car 600 miles in 24 hours',
    date: '2023-08-15T13:53:00',
    outlet: 'Tech Review',
    outletType: 'Magazine',
    outletTier: 2,
    region: 'North America',
    country: 'United States',
    language: 'English',
    sentiment: 'positive',
    estimatedAudience: 250000,
    publicityValue: 5000,
    author: 'Sarah Johnson',
    summary:
      'A comprehensive review of long-distance travel in the latest electric vehicles, focusing on charging infrastructure and battery efficiency.',
    url: 'https://example.com/article3',
    imageUrl: '/article.webp?height=200&width=200',
    tags: ['Electric Cars', 'Technology', 'Review'],
    mediaType: 'Magazine'
  }
];

// Twitter-specific mock data
const twitterPosts = [
  {
    id: '4',
    title: 'New product announcement coming soon! #innovation',
    date: '2023-08-16T10:30:00',
    outlet: 'Twitter',
    outletType: 'Social Media',
    outletTier: 1,
    region: 'Global',
    country: 'United States',
    language: 'English',
    sentiment: 'positive',
    estimatedAudience: 50000,
    publicityValue: 1200,
    author: 'TechCompany',
    summary: 'Exciting new product announcement teased by major tech company.',
    url: 'https://twitter.com/example/status/1',
    imageUrl: '/x-twitter.webp?height=200&width=200',
    tags: ['Product Launch', 'Technology'],
    mediaType: 'Twitter',
    followers: 1500000,
    impressions: 75000,
    engagements: 3200
  }
];

// Combine all articles
const allArticles = [...mockArticles, ...twitterPosts];

export default function ArticleFeed() {
  const [articles, setArticles] = useState<Article[]>(allArticles);
  const [totalResults, setTotalResults] = useState(allArticles.length);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [savedSearches, setSavedSearches] = useState<string[]>([
    'Q1 2023 Report',
    'Competitor Analysis',
    'Critical Mentions'
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    dateRange: undefined,
    searchText: '',
    searchHeadlines: '',
    excludeTags: [],
    tags: [],
    sentiment: [],
    mediaTypes: [],
    outlets: [],
    outletRegions: [],
    outletCountries: [],
    outletTiers: [],
    userTiers: [],
    verifiedUsers: false,
    criticalSearch: false,
    socialMediaTypes: [],
    postTypes: [],
    followers: '',
    impressions: '',
    premium: false,
    engagements: '',
    relevancyScore: '',
    relevancy: ''
  });

  // Handle filter changes
  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Toggle array filter values
  const toggleArrayFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => {
      const currentValues = prev[key] as string[];
      return {
        ...prev,
        [key]: currentValues.includes(value)
          ? currentValues.filter((v) => v !== value)
          : [...currentValues, value]
      };
    });
  };

  // Apply filters
  useEffect(() => {
    setIsLoading(true);

    // Simulate API call with delay
    setTimeout(() => {
      // In a real app, this would be an API call with the filters
      // For now, we'll just filter the mock data
      let filteredArticles = [...allArticles];

      // Apply text search
      if (filters.searchText) {
        filteredArticles = filteredArticles.filter(
          (article) =>
            article.title
              .toLowerCase()
              .includes(filters.searchText.toLowerCase()) ||
            article.summary
              .toLowerCase()
              .includes(filters.searchText.toLowerCase())
        );
      }

      // Apply headline search
      if (filters.searchHeadlines) {
        filteredArticles = filteredArticles.filter((article) =>
          article.title
            .toLowerCase()
            .includes(filters.searchHeadlines.toLowerCase())
        );
      }

      // Apply sentiment filter
      if (filters.sentiment.length > 0) {
        filteredArticles = filteredArticles.filter((article) =>
          filters.sentiment.includes(article.sentiment)
        );
      }

      // Apply media type filter
      if (filters.mediaTypes.length > 0) {
        filteredArticles = filteredArticles.filter((article) =>
          filters.mediaTypes.includes(article.mediaType)
        );
      }

      // Apply outlet filter
      if (filters.outlets.length > 0) {
        filteredArticles = filteredArticles.filter((article) =>
          filters.outlets.includes(article.outlet)
        );
      }

      // Apply date range filter
      if (filters.dateRange && filters.dateRange.from && filters.dateRange.to) {
        filteredArticles = filteredArticles.filter((article) => {
          const articleDate = new Date(article.date);
          return (
            articleDate >= filters.dateRange!.from! &&
            articleDate <= filters.dateRange!.to!
          );
        });
      }

      // Apply tags filter
      if (filters.tags.length > 0) {
        filteredArticles = filteredArticles.filter((article) =>
          filters.tags.some((tag) => article.tags.includes(tag))
        );
      }

      // Apply exclude tags filter
      if (filters.excludeTags.length > 0) {
        filteredArticles = filteredArticles.filter(
          (article) =>
            !filters.excludeTags.some((tag) => article.tags.includes(tag))
        );
      }

      // Apply outlet tier filter
      if (filters.outletTiers.length > 0) {
        filteredArticles = filteredArticles.filter((article) =>
          filters.outletTiers.includes(article.outletTier.toString())
        );
      }

      // Apply country filter
      if (filters.outletCountries.length > 0) {
        filteredArticles = filteredArticles.filter((article) =>
          filters.outletCountries.includes(article.country)
        );
      }

      // Apply critical search filter
      if (filters.criticalSearch) {
        // In a real app, this would filter to only show critical mentions
        // For now, we'll just filter to articles with negative sentiment
        filteredArticles = filteredArticles.filter(
          (article) => article.sentiment === 'negative'
        );
      }

      setArticles(filteredArticles);
      setTotalResults(filteredArticles.length);
      setIsLoading(false);
    }, 500);
  }, [filters]);

  // Save current search
  const saveCurrentSearch = (name: string) => {
    setSavedSearches((prev) => [...prev, name]);
  };

  // Load saved search
  const loadSavedSearch = (name: string) => {
    // In a real app, this would load the saved search from the backend
    // For now, we'll just simulate it
    if (name === 'Critical Mentions') {
      setFilters((prev) => ({
        ...prev,
        criticalSearch: true,
        sentiment: ['negative']
      }));
    } else if (name === 'Competitor Analysis') {
      setFilters((prev) => ({
        ...prev,
        tags: ['Competitor', 'Market']
      }));
    }
  };

  // Export articles
  const exportArticles = (format: 'csv' | 'excel' | 'pdf') => {
    // In a real app, this would trigger an export
    console.log(`Exporting ${articles.length} articles as ${format}`);
    // Simulate download
    alert(`Exporting ${articles.length} articles as ${format}`);
  };

  // View article details
  const viewArticleDetails = (article: Article) => {
    setSelectedArticle(article);
  };

  return (
    <PageContainer scrollable>
      <main className='container mx-auto flex-1 px-4 py-6'>
        {/* Filter Bar */}
        <div className='mb-6 rounded-lg shadow'>
          <div className='grid gap-4 p-4'>
            {/* Date and Search Row */}
            <div className='flex flex-wrap gap-2'>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant='outline' className='flex items-center gap-2'>
                    <Calendar className='h-4 w-4' />
                    {filters.dateRange?.from ? (
                      <>
                        {format(filters.dateRange.from, 'MMM d, yyyy')} -{' '}
                        {filters.dateRange.to
                          ? format(filters.dateRange.to, 'MMM d, yyyy')
                          : ''}
                      </>
                    ) : (
                      'Date Range'
                    )}
                    <ChevronDown className='ml-2 h-4 w-4' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <DatePickerWithRange
                    date={filters.dateRange}
                    onDateChange={(date) =>
                      handleFilterChange('dateRange', date)
                    }
                  />
                </PopoverContent>
              </Popover>

              <div className='relative min-w-[200px] flex-1'>
                <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
                <Input
                  placeholder='Search All Text...'
                  className='pl-10'
                  value={filters.searchText}
                  onChange={(e) =>
                    handleFilterChange('searchText', e.target.value)
                  }
                />
              </div>

              <div className='relative min-w-[200px] flex-1'>
                <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
                <Input
                  placeholder='Search Headlines...'
                  className='pl-10'
                  value={filters.searchHeadlines}
                  onChange={(e) =>
                    handleFilterChange('searchHeadlines', e.target.value)
                  }
                />
              </div>
            </div>

            {/* Filter Buttons Row */}
            <div className='flex flex-wrap gap-2'>
              {/* Tags Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant='outline' className='flex items-center gap-2'>
                    <Tag className='h-4 w-4' />
                    Tags {filters.tags.length > 0 && `(${filters.tags.length})`}
                    <ChevronDown className='ml-2 h-4 w-4' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-[250px]' align='start'>
                  <div className='space-y-2'>
                    <h3 className='font-medium'>Select Tags</h3>
                    <div className='space-y-2'>
                      {[
                        'Health',
                        'Technology',
                        'Market',
                        'Tesla',
                        'Electric Cars',
                        'Elon Musk',
                        'Cybertruck',
                        'Review',
                        'Product Launch'
                      ].map((tag) => (
                        <div key={tag} className='flex items-center space-x-2'>
                          <Checkbox
                            id={`tag-${tag}`}
                            checked={filters.tags.includes(tag)}
                            onCheckedChange={() =>
                              toggleArrayFilter('tags', tag)
                            }
                          />
                          <label htmlFor={`tag-${tag}`} className='text-sm'>
                            {tag}
                          </label>
                        </div>
                      ))}
                    </div>
                    <div className='border-t pt-2'>
                      <h3 className='mb-2 font-medium'>Saved Searches</h3>
                      <div className='space-y-1'>
                        {savedSearches.map((search) => (
                          <Button
                            key={search}
                            variant='ghost'
                            size='sm'
                            className='w-full justify-start'
                            onClick={() => loadSavedSearch(search)}
                          >
                            {search}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Exclude Tags Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant='outline' className='flex items-center gap-2'>
                    <X className='h-4 w-4' />
                    Exclude Tags{' '}
                    {filters.excludeTags.length > 0 &&
                      `(${filters.excludeTags.length})`}
                    <ChevronDown className='ml-2 h-4 w-4' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-[250px]' align='start'>
                  <div className='space-y-2'>
                    <h3 className='font-medium'>
                      Exclude Articles with These Tags
                    </h3>
                    <div className='space-y-2'>
                      {[
                        'Health',
                        'Technology',
                        'Market',
                        'Tesla',
                        'Electric Cars',
                        'Elon Musk',
                        'Cybertruck',
                        'Review'
                      ].map((tag) => (
                        <div key={tag} className='flex items-center space-x-2'>
                          <Checkbox
                            id={`exclude-tag-${tag}`}
                            checked={filters.excludeTags.includes(tag)}
                            onCheckedChange={() =>
                              toggleArrayFilter('excludeTags', tag)
                            }
                          />
                          <label
                            htmlFor={`exclude-tag-${tag}`}
                            className='text-sm'
                          >
                            {tag}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Sentiment Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant='outline' className='flex items-center gap-2'>
                    <Filter className='h-4 w-4' />
                    Sentiment{' '}
                    {filters.sentiment.length > 0 &&
                      `(${filters.sentiment.length})`}
                    <ChevronDown className='ml-2 h-4 w-4' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-[200px]' align='start'>
                  <div className='space-y-2'>
                    <h3 className='font-medium'>Select Sentiment</h3>
                    <div className='space-y-2'>
                      <div className='flex items-center space-x-2'>
                        <Checkbox
                          id='sentiment-positive'
                          checked={filters.sentiment.includes('positive')}
                          onCheckedChange={() =>
                            toggleArrayFilter('sentiment', 'positive')
                          }
                        />
                        <label htmlFor='sentiment-positive' className='text-sm'>
                          Positive
                        </label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <Checkbox
                          id='sentiment-neutral'
                          checked={filters.sentiment.includes('neutral')}
                          onCheckedChange={() =>
                            toggleArrayFilter('sentiment', 'neutral')
                          }
                        />
                        <label htmlFor='sentiment-neutral' className='text-sm'>
                          Neutral
                        </label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <Checkbox
                          id='sentiment-negative'
                          checked={filters.sentiment.includes('negative')}
                          onCheckedChange={() =>
                            toggleArrayFilter('sentiment', 'negative')
                          }
                        />
                        <label htmlFor='sentiment-negative' className='text-sm'>
                          Negative
                        </label>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Media Type Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant='outline' className='flex items-center gap-2'>
                    <Globe className='h-4 w-4' />
                    Media Types{' '}
                    {filters.mediaTypes.length > 0 &&
                      `(${filters.mediaTypes.length})`}
                    <ChevronDown className='ml-2 h-4 w-4' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-[200px]' align='start'>
                  <div className='space-y-2'>
                    <h3 className='font-medium'>Select Media Types</h3>
                    <div className='space-y-2'>
                      <div className='flex items-center space-x-2'>
                        <Checkbox
                          id='media-news'
                          checked={filters.mediaTypes.includes('News')}
                          onCheckedChange={() =>
                            toggleArrayFilter('mediaTypes', 'News')
                          }
                        />
                        <label htmlFor='media-news' className='text-sm'>
                          News
                        </label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <Checkbox
                          id='media-blog'
                          checked={filters.mediaTypes.includes('Blog')}
                          onCheckedChange={() =>
                            toggleArrayFilter('mediaTypes', 'Blog')
                          }
                        />
                        <label htmlFor='media-blog' className='text-sm'>
                          Blog
                        </label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <Checkbox
                          id='media-magazine'
                          checked={filters.mediaTypes.includes('Magazine')}
                          onCheckedChange={() =>
                            toggleArrayFilter('mediaTypes', 'Magazine')
                          }
                        />
                        <label htmlFor='media-magazine' className='text-sm'>
                          Magazine
                        </label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <Checkbox
                          id='media-twitter'
                          checked={filters.mediaTypes.includes('Twitter')}
                          onCheckedChange={() =>
                            toggleArrayFilter('mediaTypes', 'Twitter')
                          }
                        />
                        <label htmlFor='media-twitter' className='text-sm'>
                          Twitter
                        </label>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Outlet Regions Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant='outline' className='flex items-center gap-2'>
                    <Globe className='h-4 w-4' />
                    Outlet Regions{' '}
                    {filters.outletRegions.length > 0 &&
                      `(${filters.outletRegions.length})`}
                    <ChevronDown className='ml-2 h-4 w-4' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-[200px]' align='start'>
                  <div className='space-y-2'>
                    <h3 className='font-medium'>Select Regions</h3>
                    <div className='space-y-2'>
                      <div className='flex items-center space-x-2'>
                        <Checkbox
                          id='region-na'
                          checked={filters.outletRegions.includes(
                            'North America'
                          )}
                          onCheckedChange={() =>
                            toggleArrayFilter('outletRegions', 'North America')
                          }
                        />
                        <label htmlFor='region-na' className='text-sm'>
                          North America
                        </label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <Checkbox
                          id='region-europe'
                          checked={filters.outletRegions.includes('Europe')}
                          onCheckedChange={() =>
                            toggleArrayFilter('outletRegions', 'Europe')
                          }
                        />
                        <label htmlFor='region-europe' className='text-sm'>
                          Europe
                        </label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <Checkbox
                          id='region-asia'
                          checked={filters.outletRegions.includes('Asia')}
                          onCheckedChange={() =>
                            toggleArrayFilter('outletRegions', 'Asia')
                          }
                        />
                        <label htmlFor='region-asia' className='text-sm'>
                          Asia
                        </label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <Checkbox
                          id='region-global'
                          checked={filters.outletRegions.includes('Global')}
                          onCheckedChange={() =>
                            toggleArrayFilter('outletRegions', 'Global')
                          }
                        />
                        <label htmlFor='region-global' className='text-sm'>
                          Global
                        </label>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Outlet Countries Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant='outline' className='flex items-center gap-2'>
                    <Globe className='h-4 w-4' />
                    Outlet Countries{' '}
                    {filters.outletCountries.length > 0 &&
                      `(${filters.outletCountries.length})`}
                    <ChevronDown className='ml-2 h-4 w-4' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-[200px]' align='start'>
                  <div className='space-y-2'>
                    <h3 className='font-medium'>Select Countries</h3>
                    <div className='space-y-2'>
                      <div className='flex items-center space-x-2'>
                        <Checkbox
                          id='country-us'
                          checked={filters.outletCountries.includes(
                            'United States'
                          )}
                          onCheckedChange={() =>
                            toggleArrayFilter(
                              'outletCountries',
                              'United States'
                            )
                          }
                        />
                        <label htmlFor='country-us' className='text-sm'>
                          United States
                        </label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <Checkbox
                          id='country-uk'
                          checked={filters.outletCountries.includes(
                            'United Kingdom'
                          )}
                          onCheckedChange={() =>
                            toggleArrayFilter(
                              'outletCountries',
                              'United Kingdom'
                            )
                          }
                        />
                        <label htmlFor='country-uk' className='text-sm'>
                          United Kingdom
                        </label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <Checkbox
                          id='country-germany'
                          checked={filters.outletCountries.includes('Germany')}
                          onCheckedChange={() =>
                            toggleArrayFilter('outletCountries', 'Germany')
                          }
                        />
                        <label htmlFor='country-germany' className='text-sm'>
                          Germany
                        </label>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Outlets Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant='outline' className='flex items-center gap-2'>
                    <Globe className='h-4 w-4' />
                    Outlets{' '}
                    {filters.outlets.length > 0 &&
                      `(${filters.outlets.length})`}
                    <ChevronDown className='ml-2 h-4 w-4' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-[200px]' align='start'>
                  <div className='space-y-2'>
                    <h3 className='font-medium'>Select Outlets</h3>
                    <div className='space-y-2'>
                      <div className='flex items-center space-x-2'>
                        <Checkbox
                          id='outlet-sns'
                          checked={filters.outlets.includes('SNS Insider')}
                          onCheckedChange={() =>
                            toggleArrayFilter('outlets', 'SNS Insider')
                          }
                        />
                        <label htmlFor='outlet-sns' className='text-sm'>
                          SNS Insider
                        </label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <Checkbox
                          id='outlet-gettotext'
                          checked={filters.outlets.includes('Gettotext')}
                          onCheckedChange={() =>
                            toggleArrayFilter('outlets', 'Gettotext')
                          }
                        />
                        <label htmlFor='outlet-gettotext' className='text-sm'>
                          Gettotext
                        </label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <Checkbox
                          id='outlet-tech-review'
                          checked={filters.outlets.includes('Tech Review')}
                          onCheckedChange={() =>
                            toggleArrayFilter('outlets', 'Tech Review')
                          }
                        />
                        <label htmlFor='outlet-tech-review' className='text-sm'>
                          Tech Review
                        </label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <Checkbox
                          id='outlet-twitter'
                          checked={filters.outlets.includes('Twitter')}
                          onCheckedChange={() =>
                            toggleArrayFilter('outlets', 'Twitter')
                          }
                        />
                        <label htmlFor='outlet-twitter' className='text-sm'>
                          Twitter
                        </label>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Critical Search Toggle */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={filters.criticalSearch ? 'default' : 'outline'}
                      className='flex items-center gap-2'
                      onClick={() =>
                        handleFilterChange(
                          'criticalSearch',
                          !filters.criticalSearch
                        )
                      }
                    >
                      <Filter className='h-4 w-4' />
                      Critical Search
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Show only critical mentions</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Outlet Tiers Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant='outline' className='flex items-center gap-2'>
                    <Filter className='h-4 w-4' />
                    Outlet Tiers{' '}
                    {filters.outletTiers.length > 0 &&
                      `(${filters.outletTiers.length})`}
                    <ChevronDown className='ml-2 h-4 w-4' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-[200px]' align='start'>
                  <div className='space-y-2'>
                    <h3 className='font-medium'>Select Outlet Tiers</h3>
                    <div className='space-y-2'>
                      <div className='flex items-center space-x-2'>
                        <Checkbox
                          id='tier-1'
                          checked={filters.outletTiers.includes('1')}
                          onCheckedChange={() =>
                            toggleArrayFilter('outletTiers', '1')
                          }
                        />
                        <label htmlFor='tier-1' className='text-sm'>
                          Tier 1
                        </label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <Checkbox
                          id='tier-2'
                          checked={filters.outletTiers.includes('2')}
                          onCheckedChange={() =>
                            toggleArrayFilter('outletTiers', '2')
                          }
                        />
                        <label htmlFor='tier-2' className='text-sm'>
                          Tier 2
                        </label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <Checkbox
                          id='tier-3'
                          checked={filters.outletTiers.includes('3')}
                          onCheckedChange={() =>
                            toggleArrayFilter('outletTiers', '3')
                          }
                        />
                        <label htmlFor='tier-3' className='text-sm'>
                          Tier 3
                        </label>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Twitter-specific filters - conditionally shown */}
            {filters.mediaTypes.includes('Twitter') && (
              <div className='flex flex-wrap gap-2 border-t pt-2'>
                <h3 className='w-full text-sm font-medium text-gray-500'>
                  Twitter-specific filters
                </h3>

                {/* Followers Filter */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      size='sm'
                      className='flex items-center gap-2'
                    >
                      <Twitter className='h-4 w-4' />
                      Followers
                      <ChevronDown className='ml-2 h-4 w-4' />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-[200px]' align='start'>
                    <div className='space-y-2'>
                      <h3 className='font-medium'>Minimum Followers</h3>
                      <Select
                        value={filters.followers}
                        onValueChange={(value) =>
                          handleFilterChange('followers', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Select minimum' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value=''>Any</SelectItem>
                          <SelectItem value='1000'>1,000+</SelectItem>
                          <SelectItem value='10000'>10,000+</SelectItem>
                          <SelectItem value='100000'>100,000+</SelectItem>
                          <SelectItem value='1000000'>1,000,000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Impressions Filter */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      size='sm'
                      className='flex items-center gap-2'
                    >
                      <Twitter className='h-4 w-4' />
                      Impressions
                      <ChevronDown className='ml-2 h-4 w-4' />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-[200px]' align='start'>
                    <div className='space-y-2'>
                      <h3 className='font-medium'>Minimum Impressions</h3>
                      <Select
                        value={filters.impressions}
                        onValueChange={(value) =>
                          handleFilterChange('impressions', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Select minimum' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value=''>Any</SelectItem>
                          <SelectItem value='1000'>1,000+</SelectItem>
                          <SelectItem value='10000'>10,000+</SelectItem>
                          <SelectItem value='100000'>100,000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Engagements Filter */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      size='sm'
                      className='flex items-center gap-2'
                    >
                      <Twitter className='h-4 w-4' />
                      Engagements
                      <ChevronDown className='ml-2 h-4 w-4' />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-[200px]' align='start'>
                    <div className='space-y-2'>
                      <h3 className='font-medium'>Minimum Engagements</h3>
                      <Select
                        value={filters.engagements}
                        onValueChange={(value) =>
                          handleFilterChange('engagements', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Select minimum' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value=''>Any</SelectItem>
                          <SelectItem value='100'>100+</SelectItem>
                          <SelectItem value='1000'>1,000+</SelectItem>
                          <SelectItem value='10000'>10,000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Verified User Filter */}
                <Button
                  variant={filters.verifiedUsers ? 'default' : 'outline'}
                  size='sm'
                  className='flex items-center gap-2'
                  onClick={() =>
                    handleFilterChange('verifiedUsers', !filters.verifiedUsers)
                  }
                >
                  <Twitter className='h-4 w-4' />
                  Verified Users Only
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Results Controls */}
        <div className='mb-4 flex flex-wrap items-center justify-between gap-2'>
          <div className='flex items-center gap-2'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' size='sm'>
                  Actions <ChevronDown className='ml-2 h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='start'>
                <DropdownMenuItem onClick={() => exportArticles('csv')}>
                  <Download className='mr-2 h-4 w-4' />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportArticles('excel')}>
                  <Download className='mr-2 h-4 w-4' />
                  Export as Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportArticles('pdf')}>
                  <Download className='mr-2 h-4 w-4' />
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    saveCurrentSearch(
                      'New Search ' + new Date().toLocaleString()
                    )
                  }
                >
                  <Plus className='mr-2 h-4 w-4' />
                  Save Current Search
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' size='sm'>
                  Published Time <ChevronDown className='ml-2 h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='start'>
                <DropdownMenuRadioGroup>
                  <DropdownMenuRadioItem value='newest'>
                    Newest First
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='oldest'>
                    Oldest First
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className='flex items-center gap-1'>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size='icon'
                className='h-8 w-8'
                onClick={() => setViewMode('list')}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='16'
                  height='16'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <line x1='3' y1='6' x2='21' y2='6'></line>
                  <line x1='3' y1='12' x2='21' y2='12'></line>
                  <line x1='3' y1='18' x2='21' y2='18'></line>
                </svg>
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size='icon'
                className='h-8 w-8'
                onClick={() => setViewMode('grid')}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='16'
                  height='16'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <rect x='3' y='3' width='7' height='7'></rect>
                  <rect x='14' y='3' width='7' height='7'></rect>
                  <rect x='14' y='14' width='7' height='7'></rect>
                  <rect x='3' y='14' width='7' height='7'></rect>
                </svg>
              </Button>
              <Button
                variant='outline'
                size='icon'
                className='h-8 w-8'
                onClick={() => {
                  setFilters({
                    dateRange: undefined,
                    searchText: '',
                    searchHeadlines: '',
                    excludeTags: [],
                    tags: [],
                    sentiment: [],
                    mediaTypes: [],
                    outlets: [],
                    outletRegions: [],
                    outletCountries: [],
                    outletTiers: [],
                    userTiers: [],
                    verifiedUsers: false,
                    criticalSearch: false,
                    socialMediaTypes: [],
                    postTypes: [],
                    followers: '',
                    impressions: '',
                    premium: false,
                    engagements: '',
                    relevancyScore: '',
                    relevancy: ''
                  });
                }}
              >
                <RefreshCw className='h-4 w-4' />
              </Button>
            </div>
          </div>

          <div className='text-sm text-gray-500'>
            {isLoading
              ? 'Loading...'
              : `${totalResults} of ${allArticles.length} Results`}
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className='flex h-64 items-center justify-center'>
            <div className='h-12 w-12 animate-spin rounded-full border-b-2 border-primary'></div>
          </div>
        ) : (
          <>
            {viewMode === 'list' ? (
              <div className='space-y-4'>
                {articles.map((article) => (
                  <Card key={article.id} className='overflow-hidden'>
                    <div className='flex flex-col md:flex-row'>
                      <div className='md:w-1/4 lg:w-1/5'>
                        <div className='relative h-48 md:h-full'>
                          <img
                            src={article.imageUrl || '/placeholder.svg'}
                            alt={article.title}
                            className='h-full w-full object-cover'
                          />
                        </div>
                      </div>
                      <CardContent className='flex-1 p-4'>
                        <div className='flex h-full flex-col'>
                          <div className='mb-2'>
                            <div className='mb-1 flex items-center gap-2 text-sm text-gray-500'>
                              <span>
                                {format(
                                  new Date(article.date),
                                  'MMM d, yyyy HH:mm'
                                )}
                              </span>
                              <span>•</span>
                              <span>{article.outlet}</span>
                              {article.sentiment === 'positive' && (
                                <Badge
                                  variant='outline'
                                  className='border-green-200 bg-green-50 text-green-700'
                                >
                                  Positive
                                </Badge>
                              )}
                              {article.sentiment === 'neutral' && (
                                <Badge
                                  variant='outline'
                                  className='border-gray-200 bg-gray-50 text-gray-700'
                                >
                                  Neutral
                                </Badge>
                              )}
                              {article.sentiment === 'negative' && (
                                <Badge
                                  variant='outline'
                                  className='border-red-200 bg-red-50 text-red-700'
                                >
                                  Negative
                                </Badge>
                              )}
                            </div>
                            <h3 className='mb-2 text-lg font-semibold'>
                              {article.title}
                            </h3>
                          </div>
                          <p className='mb-4 text-sm text-gray-600'>
                            {article.summary}
                          </p>
                          <div className='mt-auto'>
                            <div className='mb-2 flex flex-wrap gap-1'>
                              {article.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant='secondary'
                                  className='text-xs'
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className='flex items-center justify-between'>
                              <div className='text-sm text-gray-500'>
                                <span className='font-medium'>
                                  Est. Audience:
                                </span>{' '}
                                {article.estimatedAudience.toLocaleString()}
                                <span className='mx-2'>•</span>
                                <span className='font-medium'>Value:</span> $
                                {article.publicityValue.toLocaleString()}
                              </div>
                              <Button
                                variant='outline'
                                size='sm'
                                onClick={() => viewArticleDetails(article)}
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                {articles.map((article) => (
                  <Card key={article.id} className='overflow-hidden'>
                    <div className='relative h-48'>
                      <img
                        src={article.imageUrl || '/placeholder.svg'}
                        alt={article.title}
                        className='h-full w-full object-cover'
                      />
                      <div className='absolute right-2 top-2'>
                        {article.sentiment === 'positive' && (
                          <Badge
                            variant='outline'
                            className='border-green-200 bg-green-50 text-green-700'
                          >
                            Positive
                          </Badge>
                        )}
                        {article.sentiment === 'neutral' && (
                          <Badge
                            variant='outline'
                            className='border-gray-200 bg-gray-50 text-gray-700'
                          >
                            Neutral
                          </Badge>
                        )}
                        {article.sentiment === 'negative' && (
                          <Badge
                            variant='outline'
                            className='border-red-200 bg-red-50 text-red-700'
                          >
                            Negative
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardContent className='p-4'>
                      <div className='mb-1 text-sm text-gray-500'>
                        {format(new Date(article.date), 'MMM d, yyyy')} •{' '}
                        {article.outlet}
                      </div>
                      <h3 className='mb-2 line-clamp-2 font-semibold'>
                        {article.title}
                      </h3>
                      <p className='mb-4 line-clamp-2 text-sm text-gray-600'>
                        {article.summary}
                      </p>
                      <div className='mb-2 flex flex-wrap gap-1'>
                        {article.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            variant='secondary'
                            className='text-xs'
                          >
                            {tag}
                          </Badge>
                        ))}
                        {article.tags.length > 2 && (
                          <Badge variant='secondary' className='text-xs'>
                            +{article.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                      <div className='mt-2 flex items-center justify-between'>
                        <div className='text-xs text-gray-500'>
                          <div>
                            <span className='font-medium'>Est. Audience:</span>{' '}
                            {article.estimatedAudience.toLocaleString()}
                          </div>
                          <div>
                            <span className='font-medium'>Value:</span> $
                            {article.publicityValue.toLocaleString()}
                          </div>
                        </div>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => viewArticleDetails(article)}
                        >
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Article Detail Dialog */}
      {selectedArticle && (
        <Dialog
          open={!!selectedArticle}
          onOpenChange={() => setSelectedArticle(null)}
        >
          <DialogContent className='max-w-4xl'>
            <DialogHeader>
              <DialogTitle className='text-xl'>
                {selectedArticle.title}
              </DialogTitle>
            </DialogHeader>
            <div className='grid gap-4'>
              <div className='flex flex-col gap-4 md:flex-row'>
                <div className='md:w-1/3'>
                  <img
                    src={selectedArticle.imageUrl || '/placeholder.svg'}
                    alt={selectedArticle.title}
                    className='h-48 w-full rounded-md object-cover'
                  />
                </div>
                <div className='md:w-2/3'>
                  <div className='grid gap-2'>
                    <div className='flex items-center gap-2'>
                      <span className='text-sm text-gray-500'>
                        {format(
                          new Date(selectedArticle.date),
                          'MMM d, yyyy HH:mm'
                        )}
                      </span>
                      <span>•</span>
                      <span className='text-sm font-medium'>
                        {selectedArticle.outlet}
                      </span>
                      {selectedArticle.sentiment === 'positive' && (
                        <Badge
                          variant='outline'
                          className='border-green-200 bg-green-50 text-green-700'
                        >
                          Positive
                        </Badge>
                      )}
                      {selectedArticle.sentiment === 'neutral' && (
                        <Badge
                          variant='outline'
                          className='border-gray-200 bg-gray-50 text-gray-700'
                        >
                          Neutral
                        </Badge>
                      )}
                      {selectedArticle.sentiment === 'negative' && (
                        <Badge
                          variant='outline'
                          className='border-red-200 bg-red-50 text-red-700'
                        >
                          Negative
                        </Badge>
                      )}
                    </div>
                    <h3 className='text-lg font-semibold'>
                      {selectedArticle.title}
                    </h3>
                    <p className='text-gray-600'>{selectedArticle.summary}</p>
                  </div>
                </div>
              </div>

              <Tabs defaultValue='details'>
                <TabsList className='grid w-full grid-cols-3'>
                  <TabsTrigger value='details'>Details</TabsTrigger>
                  <TabsTrigger value='metrics'>Metrics</TabsTrigger>
                  <TabsTrigger value='content'>Full Content</TabsTrigger>
                </TabsList>
                <TabsContent value='details' className='space-y-4'>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className='font-medium'>Category</TableCell>
                        <TableCell>{selectedArticle.mediaType}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className='font-medium'>Source</TableCell>
                        <TableCell>{selectedArticle.outlet}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className='font-medium'>Author</TableCell>
                        <TableCell>{selectedArticle.author}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className='font-medium'>Sentiment</TableCell>
                        <TableCell>{selectedArticle.sentiment}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className='font-medium'>Language</TableCell>
                        <TableCell>{selectedArticle.language}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className='font-medium'>Market</TableCell>
                        <TableCell>{selectedArticle.country}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className='font-medium'>Tags</TableCell>
                        <TableCell>
                          <div className='flex flex-wrap gap-1'>
                            {selectedArticle.tags.map((tag) => (
                              <Badge key={tag} variant='secondary'>
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TabsContent>
                <TabsContent value='metrics'>
                  <div className='grid gap-4'>
                    <div className='grid grid-cols-2 gap-4'>
                      <Card>
                        <CardContent className='p-4'>
                          <div className='text-sm text-gray-500'>
                            Est. Audience
                          </div>
                          <div className='text-2xl font-bold'>
                            {selectedArticle.estimatedAudience.toLocaleString()}
                          </div>
                          <div className='mt-1 text-xs text-gray-400'>
                            Data from SimilarWeb
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className='p-4'>
                          <div className='text-sm text-gray-500'>
                            Est. Publicity Value
                          </div>
                          <div className='text-2xl font-bold'>
                            ${selectedArticle.publicityValue.toLocaleString()}
                          </div>
                          <div className='mt-1 text-xs text-gray-400'>
                            AVE = Reach * 0.37 USD
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {selectedArticle.mediaType === 'Twitter' && (
                      <div className='grid grid-cols-3 gap-4'>
                        <Card>
                          <CardContent className='p-4'>
                            <div className='text-sm text-gray-500'>
                              Followers
                            </div>
                            <div className='text-2xl font-bold'>
                              {selectedArticle.followers?.toLocaleString()}
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className='p-4'>
                            <div className='text-sm text-gray-500'>
                              Impressions
                            </div>
                            <div className='text-2xl font-bold'>
                              {selectedArticle.impressions?.toLocaleString()}
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className='p-4'>
                            <div className='text-sm text-gray-500'>
                              Engagements
                            </div>
                            <div className='text-2xl font-bold'>
                              {selectedArticle.engagements?.toLocaleString()}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value='content'>
                  <div className='prose max-w-none'>
                    <p>{selectedArticle.summary}</p>
                    <p>
                      This is a placeholder for the full article content. In a
                      real application, this would contain the complete article
                      text with proper formatting, images, and other media
                      elements.
                    </p>
                    <p>
                      The full content would be retrieved from the original
                      source or from a database where the complete article has
                      been stored. For Twitter posts, this would include the
                      full tweet text, any media attachments, and possibly
                      thread information.
                    </p>
                    <div className='mt-4'>
                      <Button
                        variant='outline'
                        className='flex items-center gap-2'
                        onClick={() =>
                          window.open(selectedArticle.url, '_blank')
                        }
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='16'
                          height='16'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        >
                          <path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'></path>
                          <polyline points='15 3 21 3 21 9'></polyline>
                          <line x1='10' y1='14' x2='21' y2='3'></line>
                        </svg>
                        View Original Article
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </PageContainer>
  );
}
