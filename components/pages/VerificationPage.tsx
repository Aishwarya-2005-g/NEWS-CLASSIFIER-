
import React, { useState } from 'react';
import { Page, VerificationData, Uploader, Article } from '../../types';
import * as storageService from '../../services/storageService';
import { TagIcon } from '../icons/TagIcon';
import { UploadIcon } from '../icons/UploadIcon';

interface VerificationPageProps {
  data: VerificationData;
  uploader: Uploader | null;
  navigateTo: (page: Page) => void;
  refreshArticles: () => void;
}

const VerificationPage: React.FC<VerificationPageProps> = ({ data, uploader, navigateTo, refreshArticles }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFinalUpload = () => {
    if (!uploader) {
      alert("Error: Uploader not logged in. Redirecting to portal.");
      navigateTo(Page.UploaderPortal);
      return;
    }

    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      // Extract title from first line of content
      const firstLine = data.content.split('\n')[0];
      const title = firstLine.length > 100 ? firstLine.substring(0, 100) + '...' : firstLine;
      const summary = data.content.substring(0, 150) + '...';

      const newArticle: Article = {
        id: `article-${crypto.randomUUID()}`,
        title: title,
        summary: summary,
        content: data.content,
        thumbnail: data.thumbnail,
        topics: data.topics,
        publishDate: new Date().toISOString(),
        uploaderId: uploader.id,
        uploaderName: uploader.name,
      };
      
      storageService.saveArticle(newArticle);
      refreshArticles();
      setIsUploading(false);
      navigateTo(Page.Home);
    }, 1000);
  };
  
  return (
    <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-2xl">
      <h2 className="text-3xl font-bold text-cyan-400 mb-6 border-b-2 border-gray-700 pb-3">Verification & Final Upload</h2>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
          <TagIcon className="w-5 h-5 text-cyan-400" />
          AI Classified Topics
        </h3>
        {data.topics.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {data.topics.map(topic => (
              <span key={topic} className="bg-cyan-500/20 text-cyan-300 px-4 py-2 rounded-full text-sm font-medium">
                {topic}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">The AI could not determine specific topics. The article will be saved as "General AI".</p>
        )}
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3">Submitted Content Preview</h3>
        <div className="bg-gray-900 p-4 rounded-md max-h-80 overflow-y-auto border border-gray-700">
          <p className="text-gray-300 whitespace-pre-wrap">{data.content}</p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleFinalUpload}
          disabled={isUploading}
          className="bg-green-500 text-white px-8 py-3 rounded-md hover:bg-green-600 disabled:bg-gray-500 flex items-center gap-2 transition-colors"
        >
          <UploadIcon className="w-5 h-5" />
          {isUploading ? 'Uploading...' : 'Finalize Upload'}
        </button>
      </div>
    </div>
  );
};

export default VerificationPage;
