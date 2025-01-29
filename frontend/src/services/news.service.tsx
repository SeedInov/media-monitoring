//@ts-nocheck
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "../lib/config/axios-instance"
import { fetchAllArticlesAPIResponse } from "../types/news";
import { useParams } from "react-router-dom";




const NewsService = () => {
    const { query } = useParams();
    const useFetchAllNews = () => {
        const fetchNews = async (pageParam = 1): Promise<any[]> => {
            // Fetch articles from the API
            const response = await axios.get(`/news?offset=${pageParam}&limit=9&searchFields=title&search=${query}`);
            return response.data; // Ensure this matches your API's response
        };
        return useInfiniteQuery({
            queryKey: ["news",query],
            queryFn: ({ pageParam = 1 }) => fetchNews(pageParam),
            getNextPageParam: (lastPage, allPages) => {
                // Stop fetching if the lastPage (API response) is empty
                return lastPage.length > 0 ? allPages.length + 1 : undefined;
            },
        });
    };
    return {
        useFetchAllNews
    };
};
export default NewsService;
