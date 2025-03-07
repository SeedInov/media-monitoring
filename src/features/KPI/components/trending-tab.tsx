'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Sample data for trending hashtags
const trendingHashtags = [
  { id: 1, tag: '#football', count: 356 },
  { id: 2, tag: '#sports', count: 245 },
  { id: 3, tag: '#superbowl', count: 187 },
  { id: 4, tag: '#nfl', count: 156 },
  { id: 5, tag: '#fifa', count: 132 },
  { id: 6, tag: '#worldcup', count: 120 },
  { id: 7, tag: '#soccer', count: 110 },
  { id: 8, tag: '#euro', count: 97 },
  { id: 9, tag: '#f1', count: 89 },
  { id: 10, tag: '#tennis', count: 76 },
  { id: 11, tag: '#basketball', count: 72 },
  { id: 12, tag: '#nba', count: 68 },
  { id: 13, tag: '#golf', count: 63 },
  { id: 14, tag: '#cricket', count: 59 },
  { id: 15, tag: '#baseball', count: 54 }
];

// Sample data for top influencers
const topInfluencers = [
  {
    id: 1,
    name: 'Wall Street Journal',
    handle: '@WSJ',
    mentions: 24500,
    sentiment: 'neutral'
  },
  {
    id: 2,
    name: 'Hindustan Times',
    handle: '@htTweets',
    mentions: 19300,
    sentiment: 'positive'
  },
  {
    id: 3,
    name: 'TechCrunch',
    handle: '@TechCrunch',
    mentions: 15200,
    sentiment: 'positive'
  },
  {
    id: 4,
    name: 'Turf Football',
    handle: '@TurfFootball',
    mentions: 12400,
    sentiment: 'negative'
  },
  {
    id: 5,
    name: 'Business Bytes Pakistan',
    handle: '@BizBytesPK',
    mentions: 9300,
    sentiment: 'positive'
  },
  {
    id: 6,
    name: 'Middle East Monitor',
    handle: '@MiddleEastMnt',
    mentions: 8500,
    sentiment: 'negative'
  },
  {
    id: 7,
    name: 'South African Government',
    handle: '@GovernmentZA',
    mentions: 7200,
    sentiment: 'neutral'
  },
  {
    id: 8,
    name: 'Indonesian Rupiah',
    handle: '@IDRupiah',
    mentions: 6300,
    sentiment: 'positive'
  },
  {
    id: 9,
    name: 'Fighters Only',
    handle: '@FightersOnly',
    mentions: 5400,
    sentiment: 'positive'
  },
  {
    id: 10,
    name: 'Tennis Sydney',
    handle: '@TennisSydney',
    mentions: 4200,
    sentiment: 'positive'
  }
];

// Sample data for top sites
const topSites = [
  { id: 1, name: 'yahoo.com', visits: 2345000, sentiment: 'neutral' },
  { id: 2, name: 'msn.com', visits: 1987000, sentiment: 'positive' },
  { id: 3, name: 'cnn.com', visits: 1654000, sentiment: 'negative' },
  { id: 4, name: 'bbc.com', visits: 1432000, sentiment: 'positive' },
  { id: 5, name: 'nytimes.com', visits: 1298000, sentiment: 'neutral' },
  { id: 6, name: 'apple.com', visits: 987000, sentiment: 'positive' },
  { id: 7, name: 'theguardian.com', visits: 876000, sentiment: 'positive' },
  { id: 8, name: 'washingtonpost.com', visits: 765000, sentiment: 'neutral' },
  { id: 9, name: 'wsj.com', visits: 654000, sentiment: 'positive' },
  { id: 10, name: 'cnbc.com', visits: 543000, sentiment: 'negative' }
];

export default function TrendingTab() {
  // Function to get sentiment color
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-500';
      case 'negative':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Function to format numbers with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <div className='grid grid-cols-1 gap-4'>
      <Card>
        <CardHeader>
          <CardTitle>Trending Hashtags</CardTitle>
          <CardDescription>
            Most popular hashtags in the selected period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='space-y-2'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b'>
                    <th className='py-2 text-left'>Hashtag</th>
                    <th className='py-2 text-right'>No. of posts</th>
                  </tr>
                </thead>
                <tbody>
                  {trendingHashtags.map((item) => (
                    <tr key={item.id} className='border-b'>
                      <td className='py-2'>{item.tag}</td>
                      <td className='py-2 text-right'>{item.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className='flex flex-wrap items-start justify-center gap-2 p-4'>
              {trendingHashtags.map((item) => (
                <Badge
                  key={item.id}
                  variant='secondary'
                  className='px-2 py-1 text-xs md:text-sm'
                  style={{
                    fontSize: `${Math.max(0.8, Math.min(2, 0.8 + (item.count / 100) * 0.8))}rem`,
                    opacity: 0.7 + (item.count / 400) * 0.3
                  }}
                >
                  {item.tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Top Influencers by Voice Share</CardTitle>
            <CardDescription>
              Most influential accounts in the selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b'>
                  <th className='py-2 text-left'>Name</th>
                  <th className='py-2 text-center'>Sentiment</th>
                  <th className='py-2 text-right'>Mentions</th>
                </tr>
              </thead>
              <tbody>
                {topInfluencers.map((item) => (
                  <tr key={item.id} className='border-b'>
                    <td className='py-2'>
                      <div>
                        <div className='font-medium'>{item.name}</div>
                        <div className='text-xs text-muted-foreground'>
                          {item.handle}
                        </div>
                      </div>
                    </td>
                    <td className='py-2 text-center'>
                      <div
                        className={`inline-block h-2 w-16 rounded-full ${getSentimentColor(item.sentiment)}`}
                      ></div>
                    </td>
                    <td className='py-2 text-right'>
                      {formatNumber(item.mentions)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Sites by Visits</CardTitle>
            <CardDescription>
              Most visited sites in the selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b'>
                  <th className='py-2 text-left'>Site</th>
                  <th className='py-2 text-center'>Sentiment</th>
                  <th className='py-2 text-right'>Visits</th>
                </tr>
              </thead>
              <tbody>
                {topSites.map((item) => (
                  <tr key={item.id} className='border-b'>
                    <td className='py-2'>
                      <div className='font-medium'>{item.name}</div>
                    </td>
                    <td className='py-2 text-center'>
                      <div
                        className={`inline-block h-2 w-16 rounded-full ${getSentimentColor(item.sentiment)}`}
                      ></div>
                    </td>
                    <td className='py-2 text-right'>
                      {formatNumber(item.visits)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
