'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, Search, Info } from 'lucide-react';
import NewsService from '@/services/news.service';

export default function CrawlerDashboard() {
  const [url, setUrl] = useState('');
  const { useHandleCrawlNews } = NewsService();
  const {
    mutate: handleCrawlNews,
    isPending,
    data: crawlerResponse,
    isSuccess
  } = useHandleCrawlNews();

  const outlets = [
    {
      id: 1,
      name: 'Outlet 1',
      status: 'live',
      statusText: 'Live (in the last 7 days)'
    },
    {
      id: 2,
      name: 'Outlet 2',
      status: 'not-live',
      statusText: 'Not Live (no articles in the last 7 days)'
    },
    {
      id: 3,
      name: 'Outlet 3',
      status: 'live',
      statusText: 'Live (in the last 7 days)'
    }
  ];
  console.log(crawlerResponse);

  return (
    <div className='min-h-screen'>
      <main className='container mx-auto space-y-8 px-4 py-8'>
        {/* URL Checker Section */}
        <Card>
          <CardHeader>
            <CardTitle>Check Article URL</CardTitle>
            <CardDescription>
              Verify if an article URL exists in the database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex space-x-2'>
              <Input
                placeholder='Enter article URL to check'
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className='flex-1'
              />
              <Button
                onClick={() => {
                  handleCrawlNews(url);
                }}
              >
                <Search className='mr-2 h-4 w-4' />
                Check URL
              </Button>
            </div>
            {isSuccess && !isPending && (
              <div
                className={`mt-4 rounded-md p-4 ${crawlerResponse === true ? 'bg-green-100' : 'bg-red-100'}`}
              >
                <p className='font-medium'>{url}</p>
                <p
                  className={`text-sm ${crawlerResponse === true ? 'text-green-700' : 'text-red-700'}`}
                >
                  {crawlerResponse === true
                    ? 'The URL Exists In Database'
                    : 'The URL Doesnt Exist In Database'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Crawler Performance Section */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <div>
              <CardTitle>Crawler Performance</CardTitle>
              <CardDescription>
                Monitor the status of all outlet crawlers
              </CardDescription>
            </div>
            <Button variant='outline' size='sm'>
              <Download className='mr-2 h-4 w-4' />
              Export to Excel
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[200px]'>Outlet Name</TableHead>
                  <TableHead>Crawler Status</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {outlets.map((outlet) => (
                  <TableRow key={outlet.id}>
                    <TableCell className='font-medium'>{outlet.name}</TableCell>
                    <TableCell>
                      {outlet.status === 'live' ? (
                        <Badge
                          variant='outline'
                          className='border-green-200 bg-green-50 text-green-700'
                        >
                          {outlet.statusText}
                        </Badge>
                      ) : (
                        <Badge
                          variant='outline'
                          className='border-red-200 bg-red-50 text-red-700'
                        >
                          {outlet.statusText}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className='text-right'>
                      <Button variant='ghost' size='sm'>
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
