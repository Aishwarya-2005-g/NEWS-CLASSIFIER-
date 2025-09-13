import React from 'react';
import { Article, Page } from '../../types';
import { NEWS_TOPICS } from '../../constants';
import NewsCard from '../NewsCard';
import { UploadIcon } from '../icons/UploadIcon';

interface HomePageProps {
  articles: Article[];
  navigateTo: (page: Page, data?: any) => void;
}

const HomePage: React.FC<HomePageProps> = ({ articles, navigateTo }) => {
  const today = new Date().toISOString().split('T')[0];
  const todaysArticles = articles.filter(article => article.publishDate.startsWith(today));

  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-3xl font-bold text-cyan-400 mb-4 border-b-2 border-gray-700 pb-2">Trending Topics</h2>
        <div className="flex flex-wrap gap-3">
          {NEWS_TOPICS.slice(0, 10).map(topic => (
            <button
              key={topic}
              onClick={() => navigateTo(Page.Article, { topic })}
              className="bg-gray-800 text-cyan-300 px-4 py-2 rounded-full hover:bg-cyan-500 hover:text-white transition-all duration-300 shadow-md"
            >
              {topic}
            </button>
          ))}
        </div>
      </section>
      
      <section>
        <h2 className="text-3xl font-bold text-cyan-400 mb-4 border-b-2 border-gray-700 pb-2">Today's News</h2>
        {todaysArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {todaysArticles.map(article => (
              <NewsCard key={article.id} article={article} navigateTo={navigateTo} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-800 rounded-lg">
            <p className="text-gray-400 text-lg">No news published today. Be the first to contribute!</p>
          </div>
        )}
      </section>

      <div className="fixed bottom-8 right-8">
        <button
          onClick={() => navigateTo(Page.UploaderPortal)}
          className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-transform transform hover:scale-110 flex items-center gap-2"
          aria-label="Upload News"
        >
          <UploadIcon className="w-6 h-6" />
          <span className="font-semibold">Upload News</span>
        </button>
      </div>
    </div>
  );
};

export default HomePage;
