import React, { useState, useCallback } from 'react';
import { Page, Uploader, VerificationData } from '../../types';
import * as storageService from '../../services/storageService';
import * as geminiService from '../../services/geminiService';
import Spinner from '../Spinner';

interface UploaderPortalPageProps {
  currentUploader: Uploader | null;
  setCurrentUploader: (uploader: Uploader | null) => void;
  navigateTo: (page: Page, data?: any) => void;
}

// UploaderRegistration component defined outside to prevent re-renders
const UploaderRegistration: React.FC<{ onRegister: (uploader: Uploader) => void }> = ({ onRegister }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [qualification, setQualification] = useState('');
  const [proof, setProof] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [newUploaderId, setNewUploaderId] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (e.target.files[0].type.startsWith('image/')) {
        setProof(e.target.files[0]);
        setError('');
      } else {
        setError('Please upload a valid image file (jpg, png, etc.).');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !age || !qualification || !proof) {
      setError('All fields are required.');
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(proof);
    reader.onload = () => {
      const newId = `skynet-uid-${crypto.randomUUID()}`;
      const newUploader: Uploader = {
        id: newId,
        name,
        age: parseInt(age, 10),
        qualification,
        qualificationProof: (reader.result as string).split(',')[1] // Get base64 part
      };
      storageService.saveUploader(newUploader);
      setNewUploaderId(newId);
    };
    reader.onerror = () => setError("Failed to read file.");
  };

  if (newUploaderId) {
    return (
      <div className="text-center p-8 bg-gray-800 rounded-lg">
        <h3 className="text-2xl font-bold text-green-400 mb-4">Registration Successful!</h3>
        <p className="text-gray-300 mb-4">Please save your unique Uploader ID. You will need it to log in.</p>
        <div className="bg-gray-900 p-4 rounded-md border border-dashed border-cyan-400">
          <p className="text-lg font-mono text-cyan-300 break-all">{newUploaderId}</p>
        </div>
        <button onClick={() => onRegister(storageService.getUploaderById(newUploaderId)!)} className="mt-6 bg-cyan-500 text-white px-6 py-2 rounded-md hover:bg-cyan-600 transition-colors">
          Proceed to Upload
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold">New Uploader Registration</h3>
      <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-700 p-2 rounded-md border border-gray-600 focus:ring-cyan-500" />
      <input type="number" placeholder="Age" value={age} onChange={e => setAge(e.target.value)} className="w-full bg-gray-700 p-2 rounded-md border border-gray-600 focus:ring-cyan-500" />
      <input type="text" placeholder="Qualification (e.g., Journalism Degree)" value={qualification} onChange={e => setQualification(e.target.value)} className="w-full bg-gray-700 p-2 rounded-md border border-gray-600 focus:ring-cyan-500" />
      <div>
        <label className="block text-sm text-gray-400 mb-1">Proof of Qualification (JPG, PNG)</label>
        <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100" />
      </div>
      {error && <p className="text-red-400">{error}</p>}
      <button type="submit" className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600">Register</button>
    </form>
  );
};

// UploaderLogin component defined outside
const UploaderLogin: React.FC<{ onLogin: (uploader: Uploader) => void }> = ({ onLogin }) => {
  const [id, setId] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const uploader = storageService.getUploaderById(id);
    if (uploader) {
      onLogin(uploader);
    } else {
      setError('Invalid Uploader ID.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold">Registered Uploader Login</h3>
      <input type="text" placeholder="Enter your Unique ID" value={id} onChange={e => setId(e.target.value)} className="w-full bg-gray-700 p-2 rounded-md border border-gray-600 focus:ring-cyan-500" />
      {error && <p className="text-red-400">{error}</p>}
      <button type="submit" className="w-full bg-cyan-500 text-white p-2 rounded-md hover:bg-cyan-600">Login</button>
    </form>
  );
};

// ArticleUploader component defined outside
const ArticleUploader: React.FC<{ navigateTo: (page: Page, data: any) => void }> = ({ navigateTo }) => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
    } else {
      setError('Please select a valid image file.');
    }
  };

  const handleClassify = useCallback(async () => {
    if (!content || !image || !preview) {
      setError('Please provide both an image and article content.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const imageBase64 = preview.split(',')[1];
      const imageMimeType = image.type;

      const topics = await geminiService.classifyArticle(content, imageBase64, imageMimeType);
      const verificationData: VerificationData = {
        content,
        thumbnail: imageBase64,
        topics,
      };
      navigateTo(Page.Verification, verificationData);
    } catch (err) {
      setError('Failed to classify the article. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [content, image, preview, navigateTo]);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">1. Upload Thumbnail</h3>
          <div className="w-full h-64 bg-gray-700 rounded-lg border-2 border-dashed border-gray-500 flex items-center justify-center">
            {preview ? (
              <img src={preview} alt="Article thumbnail preview" className="w-full h-full object-cover rounded-lg"/>
            ) : (
              <p className="text-gray-400">Image Preview</p>
            )}
          </div>
          <input type="file" accept="image/*" onChange={handleImageChange} className="mt-2 w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"/>
        </div>
        <div>
           <h3 className="text-xl font-semibold mb-2">2. Add Content</h3>
           <textarea
              placeholder="Paste or write your full news content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-64 bg-gray-700 p-3 rounded-md border border-gray-600 focus:ring-cyan-500 resize-none"
           ></textarea>
        </div>
      </div>
      {error && <p className="text-red-400 text-center">{error}</p>}
      <div className="flex justify-end">
        <button
          onClick={handleClassify}
          disabled={isLoading}
          className="bg-cyan-500 text-white px-8 py-3 rounded-md hover:bg-cyan-600 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? <><Spinner /> Classifying...</> : 'Classify & Proceed'}
        </button>
      </div>
    </div>
  );
};


const UploaderPortalPage: React.FC<UploaderPortalPageProps> = ({ currentUploader, setCurrentUploader, navigateTo }) => {
  const [mode, setMode] = useState<'select' | 'register' | 'login'>('select');

  if (currentUploader) {
    return (
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl">
            <h2 className="text-3xl font-bold mb-2">Welcome Back, <span className="text-cyan-400">{currentUploader.name}</span></h2>
            <p className="text-gray-400 mb-6">You are ready to upload a new article.</p>
            <ArticleUploader navigateTo={navigateTo} />
        </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold text-center mb-6">Uploader Portal</h2>
      {mode === 'select' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-700 p-6 rounded-lg text-center">
            <h3 className="text-xl font-semibold mb-4">New Content Creator?</h3>
            <button onClick={() => setMode('register')} className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600">Register Here</button>
          </div>
          <div className="bg-gray-700 p-6 rounded-lg text-center">
            <h3 className="text-xl font-semibold mb-4">Already Registered?</h3>
            <button onClick={() => setMode('login')} className="w-full bg-cyan-500 text-white p-2 rounded-md hover:bg-cyan-600">Login with ID</button>
          </div>
        </div>
      )}
      {mode === 'register' && <UploaderRegistration onRegister={setCurrentUploader} />}
      {mode === 'login' && <UploaderLogin onLogin={setCurrentUploader} />}
    </div>
  );
};

export default UploaderPortalPage;
