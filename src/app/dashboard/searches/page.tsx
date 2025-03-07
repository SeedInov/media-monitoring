'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ChevronDown,
  Edit,
  Trash2,
  Plus,
  Globe,
  Sparkles,
  Info
} from 'lucide-react';
import PageContainer from '@/components/layout/page-container';

interface SavedSearch {
  id: number;
  name: string;
  query: string;
  excludeTerms: string;
  isCritical: boolean;
  booleanQuery: string;
}

export default function KeywordSearch() {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([
    {
      id: 1,
      name: 'Search 1',
      query: 'marketing strategy',
      excludeTerms: '',
      isCritical: false,
      booleanQuery: ''
    },
    {
      id: 2,
      name: 'Search 2',
      query: 'product launch',
      excludeTerms: 'beta',
      isCritical: true,
      booleanQuery: ''
    },
    {
      id: 3,
      name: 'Search 3',
      query: 'competitor analysis',
      excludeTerms: '',
      isCritical: false,
      booleanQuery: ''
    }
  ]);

  const [selectedSearch, setSelectedSearch] = useState<SavedSearch | null>(
    null
  );
  const [showSavedSearches, setShowSavedSearches] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [excludeTerms, setExcludeTerms] = useState('');
  const [booleanQuery, setBooleanQuery] = useState('');
  const [isCriticalSearch, setIsCriticalSearch] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiGeneratedQuery, setAiGeneratedQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'simple' | 'boolean' | 'ai'>(
    'simple'
  );

  const handleSaveSearch = () => {
    const newSearch: SavedSearch = {
      id: savedSearches.length + 1,
      name: `Search ${savedSearches.length + 1}`,
      query: searchQuery,
      excludeTerms: excludeTerms,
      isCritical: isCriticalSearch,
      booleanQuery: booleanQuery
    };

    setSavedSearches([...savedSearches, newSearch]);
    resetForm();
  };

  const handleDeleteSearch = (id: number) => {
    setSavedSearches(savedSearches.filter((search) => search.id !== id));
    if (selectedSearch && selectedSearch.id === id) {
      setSelectedSearch(null);
    }
  };

  const handleEditSearch = (search: SavedSearch) => {
    setSearchQuery(search.query);
    setExcludeTerms(search.excludeTerms);
    setIsCriticalSearch(search.isCritical);
    setBooleanQuery(search.booleanQuery);
    setSelectedSearch(search);
  };

  const handleUpdateSearch = () => {
    if (selectedSearch) {
      const updatedSearches = savedSearches.map((search) =>
        search.id === selectedSearch.id
          ? {
              ...search,
              query: searchQuery,
              excludeTerms: excludeTerms,
              isCritical: isCriticalSearch,
              booleanQuery: booleanQuery
            }
          : search
      );
      setSavedSearches(updatedSearches);
      setSelectedSearch(null);
      resetForm();
    }
  };

  const resetForm = () => {
    setSearchQuery('');
    setExcludeTerms('');
    setBooleanQuery('');
    setIsCriticalSearch(false);
    setAiTopic('');
    setAiGeneratedQuery('');
  };

  const generateAIQuery = () => {
    // Simulate AI query generation
    if (aiTopic) {
      setAiGeneratedQuery(
        `("${aiTopic}" OR "${aiTopic}-related" OR "${aiTopic} industry") AND (analysis OR report OR data)`
      );
    }
  };

  const translateSearch = () => {
    // Simulate translation functionality
    alert('Translation feature would be integrated with Google Translate API');
  };

  return (
    <PageContainer>
      <div className='grid w-full grid-cols-1 gap-6 md:grid-cols-3'>
        <div className='md:col-span-1'>
          <Card className='mb-4'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>
                Search Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div>
                  <Button
                    variant='outline'
                    className='w-full justify-between'
                    onClick={() => setShowSavedSearches(!showSavedSearches)}
                  >
                    Saved Searches
                    <ChevronDown className='ml-2 h-4 w-4' />
                  </Button>

                  {showSavedSearches && (
                    <Card className='mt-2 border shadow-md'>
                      <CardContent className='p-2'>
                        <ul className='space-y-1'>
                          {savedSearches.map((search) => (
                            <li
                              key={search.id}
                              className='flex items-center justify-between rounded p-2 hover:bg-slate-50'
                            >
                              <span className='flex items-center'>
                                {search.name}
                                {search.isCritical && (
                                  <span className='ml-2 rounded bg-red-100 px-1 text-xs text-red-800'>
                                    Critical
                                  </span>
                                )}
                              </span>
                              <div className='flex space-x-1'>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  onClick={() => handleEditSearch(search)}
                                >
                                  <Edit className='h-4 w-4' />
                                </Button>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  onClick={() => handleDeleteSearch(search.id)}
                                >
                                  <Trash2 className='h-4 w-4' />
                                </Button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <div className='flex items-center space-x-2'>
                  <Switch
                    id='critical-toggle'
                    checked={isCriticalSearch}
                    onCheckedChange={setIsCriticalSearch}
                  />
                  <Label htmlFor='critical-toggle' className='text-sm'>
                    Critical Save Search
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='ml-1 h-4 w-4 p-0'
                        >
                          <Info className='h-3 w-3' />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className='w-80'>
                        <div className='text-sm'>
                          <p>
                            Critical searches will be highlighted and
                            prioritized in your saved searches list.
                          </p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </Label>
                </div>

                <Button
                  variant='outline'
                  className='w-full'
                  onClick={translateSearch}
                >
                  <Globe className='mr-2 h-4 w-4' />
                  Translate Search
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>
                Search Examples
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type='single' collapsible>
                <AccordionItem value='item-1'>
                  <AccordionTrigger className='text-sm'>
                    CRITICAL MENTIONS Search
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className='text-xs'>
                      <p className='mb-2'>
                        This is how CRITICAL MENTIONS does search creation. You
                        can enlarge the photo for more details.
                      </p>
                      <img
                        src='/placeholder.svg?height=200&width=300'
                        alt='Critical Mentions search example'
                        className='rounded border'
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value='item-2'>
                  <AccordionTrigger className='text-sm'>
                    MELTWATER Search
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className='text-xs'>
                      <p className='mb-2'>
                        This is MELTWATER search creation (they do it using AI).
                        You can enlarge the photo for more details.
                      </p>
                      <img
                        src='/placeholder.svg?height=200&width=300'
                        alt='Meltwater search example'
                        className='rounded border'
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>

        <div className='md:col-span-2'>
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedSearch
                  ? `Edit Search: ${selectedSearch.name}`
                  : 'Create a new Search'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs
                value={searchMode}
                onValueChange={(value) => setSearchMode(value as any)}
              >
                <TabsList className='mb-4'>
                  <TabsTrigger value='simple'>Simple Search</TabsTrigger>
                  <TabsTrigger value='boolean'>Boolean Query</TabsTrigger>
                  <TabsTrigger value='ai'>AI Assisted</TabsTrigger>
                </TabsList>

                <TabsContent value='simple' className='space-y-4'>
                  <div>
                    <Label htmlFor='keywords' className='text-sm font-medium'>
                      Keywords
                    </Label>
                    <p className='mb-1 text-xs text-gray-500'>
                      Any of these words (indicate what should be the separator
                      of each word)
                    </p>
                    <Input
                      id='keywords'
                      placeholder='Enter keywords separated by spaces'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor='exclude' className='text-sm font-medium'>
                      This exact phrase
                    </Label>
                    <Input
                      id='exclude'
                      placeholder='Enter exact phrase to match'
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor='exclude-terms'
                      className='text-sm font-medium'
                    >
                      Exclude articles with these words/phrase
                    </Label>
                    <Input
                      id='exclude-terms'
                      placeholder='Enter terms to exclude'
                      value={excludeTerms}
                      onChange={(e) => setExcludeTerms(e.target.value)}
                    />
                  </div>
                </TabsContent>

                <TabsContent value='boolean' className='space-y-4'>
                  <div>
                    <Label
                      htmlFor='boolean-query'
                      className='text-sm font-medium'
                    >
                      Keywords
                    </Label>
                    <p className='mb-1 text-xs text-gray-500'>
                      Use Boolean operators: AND, OR, NOT, ( )
                    </p>
                    <Textarea
                      id='boolean-query'
                      placeholder='("AI-Hilal" OR "Al-Nassr" OR "Al-Ittihad" OR "الهلال" OR "النصر" OR "الاتحاد")'
                      value={booleanQuery}
                      onChange={(e) => setBooleanQuery(e.target.value)}
                      className='min-h-[100px]'
                    />
                  </div>

                  <div className='rounded-md bg-slate-50 p-3'>
                    <p className='mb-2 text-sm font-medium'>
                      Boolean Query Editor
                    </p>
                    <div className='flex flex-wrap gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => setBooleanQuery(booleanQuery + ' AND ')}
                      >
                        AND
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => setBooleanQuery(booleanQuery + ' OR ')}
                      >
                        OR
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => setBooleanQuery(booleanQuery + ' NOT ')}
                      >
                        NOT
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => setBooleanQuery(booleanQuery + ' ( ')}
                      >
                        ( )
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => setBooleanQuery(booleanQuery + ' "')}
                      >
                        ""
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value='ai' className='space-y-4'>
                  <div>
                    <Label htmlFor='ai-topic' className='text-sm font-medium'>
                      AI to write a search query on these topic:
                    </Label>
                    <div className='flex gap-2'>
                      <Input
                        id='ai-topic'
                        placeholder='top 5 football clubs in saudi in arabic and english'
                        value={aiTopic}
                        onChange={(e) => setAiTopic(e.target.value)}
                      />
                      <Button
                        onClick={generateAIQuery}
                        className='whitespace-nowrap'
                      >
                        <Sparkles className='mr-2 h-4 w-4' />
                        Generate
                      </Button>
                    </div>
                  </div>

                  {aiGeneratedQuery && (
                    <div className='mt-4'>
                      <Label
                        htmlFor='ai-generated'
                        className='text-sm font-medium'
                      >
                        AI Generated Query:
                      </Label>
                      <Textarea
                        id='ai-generated'
                        value={aiGeneratedQuery}
                        onChange={(e) => setAiGeneratedQuery(e.target.value)}
                        className='min-h-[100px]'
                      />
                      <Button
                        variant='outline'
                        size='sm'
                        className='mt-2'
                        onClick={() => setBooleanQuery(aiGeneratedQuery)}
                      >
                        Use this query
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <div className='mt-6 flex justify-end space-x-2'>
                <Button variant='outline' onClick={resetForm}>
                  Cancel
                </Button>
                {selectedSearch ? (
                  <Button onClick={handleUpdateSearch}>Update Search</Button>
                ) : (
                  <Button onClick={handleSaveSearch}>
                    <Plus className='mr-2 h-4 w-4' />
                    Save Search
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
