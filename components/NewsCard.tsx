
import React from 'react';
import { Article, Page } from '../types';

interface NewsCardProps {
  article: Article;
  navigateTo: (page: Page, data?: any) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, navigateTo }) => {
  return (
    <div 
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col"
      onClick={() => navigateTo(Page.Article, { articleId: article.id })}
    >
      <img 
        src={article.thumbnail.startsWith('https') ? article.thumbnail : `data:image/jpeg;base64,${article.thumbnail}`} 
        alt={article.title} 
        className="w-full h-48 object-cover" 
      />
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{article.title}</h3>
          <p className="text-gray-400 text-sm mb-3 line-clamp-3">{article.summary}</p>
        </div>
        <div className="mt-auto pt-3 border-t border-gray-700">
           <div className="flex flex-wrap gap-2">
            {article.topics.slice(0, 2).map(topic => (
              <span key={topic} className="bg-gray-700 text-cyan-300 px-2 py-1 text-xs rounded-full">{topic}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
