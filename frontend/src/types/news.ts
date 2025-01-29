export type Sentiment = 'positive' | 'negative' | 'neutral';

export interface BaseNewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  imageUrl: string;
  author?: string;
  sentiment: Sentiment;
}

export interface Story extends BaseNewsItem {}
export interface Pick extends BaseNewsItem {}



export type articleType = {
  url: string;
  read_more_link: string;
  language: string;
  title: string;
  top_image: string;
  meta_img: string;
  images: string[];
  movies: string[];
  keywords: string[];
  meta_keywords: string[];
  tags: string[] | null;
  authors: string[];
  publish_date: string | null;
  summary: string;
  meta_description: string;
  meta_lang: string;
  meta_favicon: string;
  source:string;
  date:string;
  meta_site_name: string;
  canonical_link: string;
  text: string;
  id: string;
};

export type fetchAllArticlesAPIResponse = articleType[];
