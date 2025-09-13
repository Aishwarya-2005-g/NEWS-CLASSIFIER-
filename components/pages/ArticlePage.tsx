import React, { useState, useEffect, useMemo } from 'react';
import { Article, Page } from '../../types';
import { NEWS_TOPICS } from '../../constants';
import NewsCard from '../NewsCard';
import { CalendarIcon } from '../icons/CalendarIcon';
import { TagIcon } from '../icons/TagIcon';
import { BackIcon } from '../icons/BackIcon';

interface ArticlePageProps {
  allArticles: Article[];
  activeArticle: Article | null;
  initialSearch: { query: string; type: 'topic' | 'date' } | null;
  navigateTo: (page: Page, data?: any) => void;
}

const ArticlePage: React.FC<ArticlePageProps> = ({ allArticles, activeArticle, initialSearch, navigateTo }) => {
  const [searchDate, setSearchDate] = useState('');
  const [searchTopics, setSearchTopics] = useState<string[]>([]);
  
  useEffect(() => {
    if (initialSearch?.type === 'topic') {
      setSearchTopics([initialSearch.query]);
      setSearchDate('');
    }
    if (initialSearch?.type === 'date') {
      setSearchDate(initialSearch.query);
      setSearchTopics([]);
    }
  }, [initialSearch]);

  const filteredArticles = useMemo(() => {
    return allArticles.filter(article => {
      const dateMatch = !searchDate || article.publishDate.startsWith(searchDate);
      const topicMatch = searchTopics.length === 0 || searchTopics.every(topic => article.topics.includes(topic));
      return dateMatch && topicMatch;
    });
  }, [allArticles, searchDate, searchTopics]);

  const toggleTopic = (topic: string) => {
    setSearchTopics(prev => 
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

  if (activeArticle) {
    return (
      <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-2xl">
        <button onClick={() => navigateTo(Page.Article)} className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-6">
          <BackIcon className="w-5 h-5" />
          Back to Search
        </button>
        <img src={activeArticle.thumbnail.startsWith('https') ? activeArticle.thumbnail : `data:image/jpeg;base64,${activeArticle.thumbnail}`} alt={activeArticle.title} className="w-full h-96 object-cover rounded-md mb-6" />
        <h1 className="text-4xl font-bold mb-4 text-white">{activeArticle.title}</h1>
        <div className="flex items-center text-gray-400 text-sm mb-4 gap-4">
          <span>By {activeArticle.uploaderName}</span>
          <span>{new Date(activeArticle.publishDate).toLocaleDateString()}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {activeArticle.topics.map(topic => (
            <span key={topic} className="bg-gray-700 text-cyan-300 px-3 py-1 text-xs rounded-full">{topic}</span>
          ))}
        </div>
        <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap">
          {activeArticle.content}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Search News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 text-gray-300 mb-2" htmlFor="date-search">
              <CalendarIcon className="w-5 h-5"/>
              Filter by Date
            </label>
            <input
              id="date-search"
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-gray-300 mb-2">
              <TagIcon className="w-5 h-5"/>
              Filter by Topic
            </label>
            <div className="bg-gray-700 border border-gray-600 rounded-md p-2 flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {NEWS_TOPICS.map(topic => (
                <button
                  key={topic}
                  onClick={() => toggleTopic(topic)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${
                    searchTopics.includes(topic)
                      ? 'bg-cyan-500 text-white'
                      : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4">{filteredArticles.length} results found</h3>
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map(article => (
              <NewsCard key={article.id} article={article} navigateTo={navigateTo} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-800 rounded-lg">
            <p className="text-gray-400">No articles match your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlePage;
