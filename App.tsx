
import React, { useState, useEffect, useCallback } from 'react';
import { Page, User, Uploader, Article, VerificationData } from './types';
import * as storageService from './services/storageService';
import Header from './components/Header';
import HomePage from './components/pages/HomePage';
import ArticlePage from './components/pages/ArticlePage';
import UploaderPortalPage from './components/pages/UploaderPortalPage';
import VerificationPage from './components/pages/VerificationPage';
import LoginPage from './components/pages/LoginPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUploader, setCurrentUploader] = useState<Uploader | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [verificationData, setVerificationData] = useState<VerificationData | null>(null);
  const [initialSearch, setInitialSearch] = useState<{ query: string; type: 'topic' | 'date' } | null>(null);

  useEffect(() => {
    setArticles(storageService.getArticles());
    const user = storageService.getCurrentUser();
    if (user) setCurrentUser(user);
    const uploader = storageService.getCurrentUploader();
    if(uploader) setCurrentUploader(uploader);
  }, []);
  
  const refreshArticles = useCallback(() => {
    setArticles(storageService.getArticles());
  }, []);

  const handleLogout = useCallback(() => {
    storageService.logoutUser();
    storageService.logoutUploader();
    setCurrentUser(null);
    setCurrentUploader(null);
    setCurrentPage(Page.Home);
  }, []);

  const navigateTo = useCallback((page: Page, data?: any) => {
    if (page === Page.Article) {
      if (data?.articleId) {
        const article = articles.find(a => a.id === data.articleId);
        setActiveArticle(article || null);
        setInitialSearch(null);
      } else if (data?.topic) {
        setActiveArticle(null);
        setInitialSearch({ query: data.topic, type: 'topic' });
      } else {
        setActiveArticle(null);
        setInitialSearch(null);
      }
    } else if (page === Page.Verification) {
      setVerificationData(data as VerificationData);
    }
    setCurrentPage(page);
  }, [articles]);

  const renderPage = () => {
    switch (currentPage) {
      case Page.Home:
        return <HomePage articles={articles} navigateTo={navigateTo} />;
      case Page.Article:
        return <ArticlePage allArticles={articles} activeArticle={activeArticle} initialSearch={initialSearch} navigateTo={navigateTo}/>;
      case Page.UploaderPortal:
        return <UploaderPortalPage 
          currentUploader={currentUploader} 
          setCurrentUploader={setCurrentUploader} 
          navigateTo={navigateTo} 
          />;
      case Page.Verification:
        if (!verificationData) {
            navigateTo(Page.Home);
            return null;
        }
        return <VerificationPage data={verificationData} navigateTo={navigateTo} refreshArticles={refreshArticles} uploader={currentUploader}/>;
      case Page.Login:
        return <LoginPage setCurrentUser={setCurrentUser} navigateTo={navigateTo} />;
      default:
        return <HomePage articles={articles} navigateTo={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 font-sans">
      <Header 
        user={currentUser || currentUploader}
        navigateTo={navigateTo} 
        handleLogout={handleLogout}
      />
      <main className="container mx-auto px-4 py-8">
        {renderPage()}
      </main>
    </div>
  );
}
