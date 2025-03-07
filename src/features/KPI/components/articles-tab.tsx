'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';
import NewsService from '@/services/news.service';

// Sample data for the charts
const volumeData = [
  { date: '01 Jan', mentions: 400, reach: 240 },
  { date: '02 Jan', mentions: 300, reach: 139 },
  { date: '03 Jan', mentions: 200, reach: 980 },
  { date: '04 Jan', mentions: 278, reach: 390 },
  { date: '05 Jan', mentions: 189, reach: 480 },
  { date: '06 Jan', mentions: 239, reach: 380 },
  { date: '07 Jan', mentions: 349, reach: 430 },
  { date: '08 Jan', mentions: 558, reach: 520 },
  { date: '09 Jan', mentions: 439, reach: 380 },
  { date: '10 Jan', mentions: 349, reach: 290 },
  { date: '11 Jan', mentions: 558, reach: 520 },
  { date: '12 Jan', mentions: 439, reach: 380 },
  { date: '13 Jan', mentions: 349, reach: 290 }
];

const sentimentData = [
  { date: '01 Jan', positive: 40, negative: 24, neutral: 36 },
  { date: '02 Jan', positive: 30, negative: 13, neutral: 57 },
  { date: '03 Jan', positive: 20, negative: 98, neutral: 22 },
  { date: '04 Jan', positive: 27, negative: 39, neutral: 34 },
  { date: '05 Jan', positive: 18, negative: 48, neutral: 34 },
  { date: '06 Jan', positive: 23, negative: 38, neutral: 39 },
  { date: '07 Jan', positive: 34, negative: 43, neutral: 23 },
  { date: '08 Jan', positive: 55, negative: 52, neutral: 13 },
  { date: '09 Jan', positive: 43, negative: 38, neutral: 19 },
  { date: '10 Jan', positive: 34, negative: 29, neutral: 37 },
  { date: '11 Jan', positive: 55, negative: 52, neutral: 13 },
  { date: '12 Jan', positive: 43, negative: 38, neutral: 19 },
  { date: '13 Jan', positive: 34, negative: 29, neutral: 37 }
];

export default function ArticlesTab() {
  const { useFetchSentimentAggregateByDate } = NewsService();
  const { data: sentimentAggregate } = useFetchSentimentAggregateByDate();
  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-1 gap-4'>
        <Card>
          <CardHeader className='pb-2'>
            <div className='flex items-center justify-between'>
              <div>
                <CardTitle>Articles</CardTitle>
                <CardDescription>
                  Filter and search articles across all sources
                </CardDescription>
              </div>
              <Select defaultValue='all'>
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='All Articles' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Articles</SelectItem>
                  <SelectItem value='news'>News</SelectItem>
                  <SelectItem value='social'>Social Media</SelectItem>
                  <SelectItem value='blogs'>Blogs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className='mb-4 flex flex-col gap-4 md:flex-row'>
              <div className='flex-1'>
                <Input placeholder='Search All Text...' />
              </div>
              <div className='flex-1'>
                <Input placeholder='Search Headlines...' />
              </div>
            </div>

            <div className='mb-4 flex flex-wrap gap-2'>
              <Badge variant='secondary' className='cursor-pointer'>
                Tags +
              </Badge>
              <Badge variant='secondary' className='cursor-pointer'>
                Sentiment +
              </Badge>
              <Badge variant='secondary' className='cursor-pointer'>
                Media Types +
              </Badge>
              <Badge variant='secondary' className='cursor-pointer'>
                Outlet Regions
              </Badge>
              <Badge variant='secondary' className='cursor-pointer'>
                Outlet Countries +
              </Badge>
              <Badge variant='secondary' className='cursor-pointer'>
                Outlet States
              </Badge>
              <Badge variant='secondary' className='cursor-pointer'>
                Outlets
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='grid grid-cols-1 gap-4'>
        <Card>
          <CardHeader>
            <CardTitle>Volume of Mentions & Reach</CardTitle>
            <CardDescription>
              Track mentions and reach over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='h-[300px]'>
              <ResponsiveContainer width='100%' height='100%'>
                <AreaChart
                  data={volumeData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id='colorMentions'
                      x1='0'
                      y1='0'
                      x2='0'
                      y2='1'
                    >
                      <stop offset='5%' stopColor='#8884d8' stopOpacity={0.8} />
                      <stop offset='95%' stopColor='#8884d8' stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id='colorReach' x1='0' y1='0' x2='0' y2='1'>
                      <stop offset='5%' stopColor='#82ca9d' stopOpacity={0.8} />
                      <stop offset='95%' stopColor='#82ca9d' stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey='date' />
                  <YAxis />
                  <CartesianGrid strokeDasharray='3 3' />
                  <Tooltip />
                  <Legend />
                  <Area
                    type='monotone'
                    dataKey='mentions'
                    stroke='#8884d8'
                    fillOpacity={1}
                    fill='url(#colorMentions)'
                  />
                  <Area
                    type='monotone'
                    dataKey='reach'
                    stroke='#82ca9d'
                    fillOpacity={1}
                    fill='url(#colorReach)'
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='grid grid-cols-1 gap-4'>
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Over Time</CardTitle>
            <CardDescription>
              Track sentiment trends across your mentions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='h-[300px]'>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart
                  data={sentimentAggregate || []}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='date' />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type='monotone'
                    dataKey='positive'
                    stroke='#82ca9d'
                    strokeWidth={2}
                  />
                  <Line
                    type='monotone'
                    dataKey='negative'
                    stroke='#ff6b6b'
                    strokeWidth={2}
                  />
                  <Line
                    type='monotone'
                    dataKey='neutral'
                    stroke='#8884d8'
                    strokeWidth={2}
                  />
                  <Line
                    type='monotone'
                    dataKey='very negative'
                    stroke='#ff6b6b'
                    strokeWidth={2}
                  />
                  <Line
                    type='monotone'
                    dataKey='very positive'
                    stroke='#82ca9d'
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
