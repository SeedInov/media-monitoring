'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Sample data for the charts
const mediaTypeData = [
  { name: 'Facebook', positive: 65, neutral: 20, negative: 15 },
  { name: 'Instagram', positive: 70, neutral: 20, negative: 10 },
  { name: 'Twitter', positive: 55, neutral: 25, negative: 20 },
  { name: 'LinkedIn', positive: 75, neutral: 15, negative: 10 },
  { name: 'YouTube', positive: 60, neutral: 25, negative: 15 },
  { name: 'Pinterest', positive: 80, neutral: 15, negative: 5 },
  { name: 'News', positive: 50, neutral: 30, negative: 20 },
  { name: 'Blogs', positive: 55, neutral: 30, negative: 15 },
  { name: 'Web', positive: 60, neutral: 25, negative: 15 }
];

const sentimentByMediaData = [
  { name: 'Facebook', positive: 65, neutral: 20, negative: 15 },
  { name: 'Instagram', positive: 70, neutral: 20, negative: 10 },
  { name: 'Twitter', positive: 55, neutral: 25, negative: 20 },
  { name: 'LinkedIn', positive: 75, neutral: 15, negative: 10 },
  { name: 'YouTube', positive: 60, neutral: 25, negative: 15 },
  { name: 'Pinterest', positive: 80, neutral: 15, negative: 5 },
  { name: 'News', positive: 50, neutral: 30, negative: 20 },
  { name: 'Blogs', positive: 55, neutral: 30, negative: 15 },
  { name: 'Web', positive: 60, neutral: 25, negative: 15 }
];

const languageData = [
  { name: 'English', positive: 65, neutral: 20, negative: 15 }
];

const sentimentByLanguageData = [
  { name: 'English', positive: 65, neutral: 20, negative: 15 }
];

export default function MediaAnalysisTab() {
  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
      <Card>
        <CardHeader>
          <CardTitle>Volume by Media Type</CardTitle>
          <CardDescription>
            Distribution of volume across different media types
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='h-[300px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart
                data={mediaTypeData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey='negative' stackId='a' fill='#F44336' />
                <Bar dataKey='neutral' stackId='a' fill='#9E9E9E' />
                <Bar dataKey='positive' stackId='a' fill='#4CAF50' />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className='mt-4'>
            <p className='text-sm text-muted-foreground'>
              The volume won't have colors, just a sum of all the articles/posts
              found in the selected period
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sentiment by Media Type</CardTitle>
          <CardDescription>
            Sentiment distribution across different media types
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='h-[300px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart
                data={sentimentByMediaData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey='negative' stackId='a' fill='#F44336' />
                <Bar dataKey='neutral' stackId='a' fill='#9E9E9E' />
                <Bar dataKey='positive' stackId='a' fill='#4CAF50' />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className='mt-4'>
            <p className='text-sm text-muted-foreground'>
              Only two media type: Social Media and Online Outlets (later on we
              will add more)
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Volume by Language</CardTitle>
          <CardDescription>
            Distribution of volume across different languages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='h-[300px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart
                data={languageData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey='negative' stackId='a' fill='#F44336' />
                <Bar dataKey='neutral' stackId='a' fill='#9E9E9E' />
                <Bar dataKey='positive' stackId='a' fill='#4CAF50' />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sentiment by Language</CardTitle>
          <CardDescription>
            Sentiment distribution across different languages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='h-[300px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart
                data={sentimentByLanguageData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey='negative' stackId='a' fill='#F44336' />
                <Bar dataKey='neutral' stackId='a' fill='#9E9E9E' />
                <Bar dataKey='positive' stackId='a' fill='#4CAF50' />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
