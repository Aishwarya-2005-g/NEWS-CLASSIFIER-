

import React from 'react';
import { Page, User, Uploader } from '../types';
import { RobotIcon } from './icons/RobotIcon';

interface HeaderProps {
  user: User | Uploader | null;
  navigateTo: (page: Page) => void;
  handleLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, navigateTo, handleLogout }) => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-700">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigateTo(Page.Home)}
        >
          <RobotIcon className="w-8 h-8 text-cyan-400 group-hover:animate-pulse" />
          <h1 className="text-2xl font-bold tracking-wider text-white">
            SKYNET<span className="text-cyan-400">NEWS</span>
          </h1>
        </div>
        <nav className="flex items-center gap-4">
          <button
            onClick={() => navigateTo(Page.Article)}
            className="text-gray-300 hover:text-cyan-400 transition-colors duration-200"
          >
            Search News
          </button>
          <button
            onClick={() => navigateTo(Page.UploaderPortal)}
            className="text-gray-300 hover:text-cyan-400 transition-colors duration-200"
          >
            Uploader Portal
          </button>
          <div className="w-px h-6 bg-gray-600"></div>
          {user ? (
            <div className="flex items-center gap-3">
              {/* FIX: Use a type guard to safely access properties on the User | Uploader union type. */}
              <span className="text-gray-300">Welcome, {'name' in user ? user.name : user.username}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors duration-200 text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigateTo(Page.Login)}
              className="bg-cyan-500 text-white px-4 py-1.5 rounded-md hover:bg-cyan-600 transition-colors duration-200"
            >
              Login
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;