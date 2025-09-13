
import React, { useState } from 'react';
import { Page, User } from '../../types';
import * as storageService from '../../services/storageService';

interface LoginPageProps {
  setCurrentUser: (user: User) => void;
  navigateTo: (page: Page) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ setCurrentUser, navigateTo }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      // NOTE: Password check is omitted as we are not storing it.
      // In a real app, this would involve an API call to a secure backend.
      const user = storageService.loginUser(email);
      if (user) {
        setCurrentUser(user);
        navigateTo(Page.Home);
      } else {
        setError('No user found with that email.');
      }
    } else {
      if (!username || !email || !password) {
        setError('Please fill all fields.');
        return;
      }
      const success = storageService.saveUser({ username, email });
      if (success) {
        const user = storageService.loginUser(email);
        if (user) {
          setCurrentUser(user);
          navigateTo(Page.Home);
        }
      } else {
        setError('A user with this email already exists.');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
        <h2 className="text-3xl font-bold text-center text-cyan-400 mb-6">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-700 text-white p-3 rounded-md border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-700 text-white p-3 rounded-md border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-700 text-white p-3 rounded-md border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
          />
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-cyan-500 text-white p-3 rounded-md font-semibold hover:bg-cyan-600 transition-colors duration-300"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <p className="text-center text-gray-400 mt-6">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button onClick={() => setIsLogin(!isLogin)} className="text-cyan-400 hover:underline ml-2">
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
