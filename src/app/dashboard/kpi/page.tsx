'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { CalendarIcon, Download, Filter, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

import ArticlesTab from '@/features/KPI/components/articles-tab';
import ShareOfVoiceTab from '@/features/KPI/components/share-of-voice-tab';
import MediaAnalysisTab from '@/features/KPI/components/media-analysis-tab';
import TrendingTab from '@/features/KPI/components/trending-tab';
import PageContainer from '@/components/layout/page-container';

export default function KpiDashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <PageContainer scrollable>
      <div className='w-full space-y-4'>
        <div className='flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>
              Media Monitoring KPIs
            </h1>
            <p className='text-muted-foreground'>
              Track and analyze media mentions and sentiment across platforms.
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  className='w-[240px] justify-start text-left font-normal'
                >
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='end'>
                <Calendar
                  mode='single'
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button variant='outline' size='icon'>
              <RefreshCw className='h-4 w-4' />
            </Button>
            <Button variant='outline' size='icon'>
              <Download className='h-4 w-4' />
            </Button>
          </div>
        </div>

        <div className='flex flex-wrap items-center gap-2'>
          <Badge variant='outline' className='rounded-md px-3 py-1'>
            <span className='mr-1 font-semibold'>Brand:</span> CARMA Automotive
            <button className='ml-2 text-xs'>×</button>
          </Badge>
          <Badge variant='outline' className='rounded-md px-3 py-1'>
            <span className='mr-1 font-semibold'>Period:</span> Last 30 days
            <button className='ml-2 text-xs'>×</button>
          </Badge>
          <Button variant='ghost' size='sm' className='gap-1'>
            <Filter className='h-3.5 w-3.5' />
            Add Filter
          </Button>
        </div>

        <Tabs defaultValue='articles' className='w-full'>
          <TabsList className='grid w-full max-w-3xl grid-cols-4'>
            <TabsTrigger value='articles'>Articles</TabsTrigger>
            <TabsTrigger value='share-of-voice'>Share of Voice</TabsTrigger>
            <TabsTrigger value='media-analysis'>Media Analysis</TabsTrigger>
            <TabsTrigger value='trending'>Trending</TabsTrigger>
          </TabsList>

          <TabsContent value='articles' className='mt-4'>
            <ArticlesTab />
          </TabsContent>

          <TabsContent value='share-of-voice' className='mt-4'>
            <ShareOfVoiceTab />
          </TabsContent>

          <TabsContent value='media-analysis' className='mt-4'>
            <MediaAnalysisTab />
          </TabsContent>

          <TabsContent value='trending' className='mt-4'>
            <TrendingTab />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
