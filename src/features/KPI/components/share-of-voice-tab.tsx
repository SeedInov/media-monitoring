'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from 'react-simple-maps';
import NewsService from '@/services/news.service';

// Sample data for the charts
const shareOfVoiceData = [
  { name: 'Instagram', value: 35, color: '#E1306C' },
  { name: 'Twitter', value: 25, color: '#1DA1F2' },
  { name: 'News', value: 15, color: '#FF9900' },
  { name: 'Blogs', value: 10, color: '#6441A4' },
  { name: 'YouTube', value: 8, color: '#FF0000' },
  { name: 'Others', value: 7, color: '#8884d8' }
];

const sentimentData = [
  { name: 'Positive', value: 55, color: '#4CAF50' },
  { name: 'Neutral', value: 30, color: '#9E9E9E' },
  { name: 'Negative', value: 15, color: '#F44336' },
  { name: 'Very Positive', value: 55, color: '#4CAF50' },
  { name: 'Very Negative', value: 15, color: '#F44336' }
];

const topCountriesData = [
  { id: 1, country: 'U.S.A.', count: 156 },
  { id: 2, country: 'United Kingdom', count: 97 },
  { id: 3, country: 'Saudi Arabia', count: 72 },
  { id: 4, country: 'India', count: 65 },
  { id: 5, country: 'Pakistan', count: 51 },
  { id: 6, country: 'Germany', count: 47 },
  { id: 7, country: 'U.A.E.', count: 43 },
  { id: 8, country: 'France', count: 38 },
  { id: 9, country: 'Turkey', count: 32 },
  { id: 10, country: 'Others', count: 91 }
];

const countrySentimentData = [
  { id: 1, country: 'U.S.A.', positive: 65, neutral: 25, negative: 10 },
  { id: 2, country: 'United Kingdom', positive: 55, neutral: 30, negative: 15 },
  { id: 3, country: 'Saudi Arabia', positive: 70, neutral: 20, negative: 10 },
  { id: 4, country: 'India', positive: 45, neutral: 35, negative: 20 },
  { id: 5, country: 'Pakistan', positive: 60, neutral: 25, negative: 15 },
  { id: 6, country: 'Germany', positive: 50, neutral: 40, negative: 10 },
  { id: 7, country: 'U.A.E.', positive: 75, neutral: 15, negative: 10 },
  { id: 8, country: 'France', positive: 45, neutral: 40, negative: 15 },
  { id: 9, country: 'Turkey', positive: 40, neutral: 35, negative: 25 },
  { id: 10, country: 'Others', positive: 50, neutral: 30, negative: 20 }
];

// GeoJSON for the world map
const geoUrl =
  'https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json';

export default function ShareOfVoiceTab() {
  const {
    useFetchOverallSentimentAggregate,
    useFetchSentimentAggregateByCountry
  } = NewsService();
  const { data: aggregateData } = useFetchOverallSentimentAggregate();
  const { data: aggregateCountryData } = useFetchSentimentAggregateByCountry();

  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
      <Card>
        <CardHeader>
          <CardTitle>Share of Voice</CardTitle>
          <CardDescription>
            Distribution of mentions across platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='h-[300px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie
                  data={shareOfVoiceData}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  outerRadius={80}
                  fill='#8884d8'
                  dataKey='value'
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {shareOfVoiceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={sentimentData[index]?.color}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className='mt-4'>
            <p className='text-sm text-muted-foreground'>
              Aggregated sum of the volume in the selected period for each
              source/channel
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sentiment</CardTitle>
          <CardDescription>Overall sentiment distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='h-[300px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie
                  data={aggregateData || []}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  outerRadius={80}
                  fill='#8884d8'
                  dataKey='count'
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {aggregateData?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={sentimentData[index].color}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className='mt-4'>
            <p className='text-sm text-muted-foreground'>
              For each of the search queries I will see the sentiment
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Countries</CardTitle>
          <CardDescription>Where news is coming from</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='h-[300px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <ComposableMap>
                <ZoomableGroup zoom={1}>
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo) => (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill='#D6D6DA'
                          stroke='#FFFFFF'
                          style={{
                            default: { outline: 'none' },
                            hover: { outline: 'none', fill: '#9998D6' },
                            pressed: { outline: 'none' }
                          }}
                        />
                      ))
                    }
                  </Geographies>
                </ZoomableGroup>
              </ComposableMap>
            </ResponsiveContainer>
          </div>
          <div className='mt-4 max-h-[200px] overflow-y-auto'>
            <table className='w-full text-sm'>
              <tbody>
                {topCountriesData.map((item) => (
                  <tr key={item.id} className='border-b'>
                    <td className='py-2'>
                      {item.id}. {item.country}
                    </td>
                    <td className='py-2 text-right'>{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sentiment by Country</CardTitle>
          <CardDescription>
            Sentiment distribution across countries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='max-h-[500px] overflow-y-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b'>
                  <th className='py-2 text-left'>Country</th>
                  <th className='py-2 text-right'>Positive</th>
                  <th className='py-2 text-right'>Neutral</th>
                  <th className='py-2 text-right'>Negative</th>
                  <th className='py-2 text-right'>V.Negative</th>
                  <th className='py-2 text-right'>V.Positive</th>
                </tr>
              </thead>
              <tbody>
                {aggregateCountryData?.map((item) => (
                  <tr key={item.id} className='border-b'>
                    <td className='py-2'>{item.country}</td>
                    <td className='py-2 text-right text-green-600'>
                      {item.positive}%
                    </td>
                    <td className='py-2 text-right text-gray-500'>
                      {item.neutral}%
                    </td>
                    <td className='py-2 text-right text-red-600'>
                      {item.negative}%
                    </td>
                    <td className='py-2 text-right text-red-600'>
                      {item.very_negative}%
                    </td>
                    <td className='py-2 text-right text-red-600'>
                      {item.very_positive}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
