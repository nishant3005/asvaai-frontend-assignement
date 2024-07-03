import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

const UrlInput = ({ url, setUrl, fetchContent }) => {
  const [error, setError] = useState('');

  const handleFetchContent = async () => {
    if (!url.trim()) {
      toast.error('URL cannot be empty.');
      return;
    }
    if (!isValidUrl(url)) {
      toast.error('Invalid URL format.');
      return;
    }
    try {
      const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
      const response = await axios.get(`${proxyUrl}${url}`);
      console.log(response);
      const html = response.data;
      fetchContent(html);
    } catch (error) {
      toast.error('Failed to fetch content.');
    }
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  return (
    <div className="max-w mx-auto p-4 border rounded-md">
      <h2 className="text-xl font-bold mb-4">Fetch Content</h2>
      <div className="flex flex-col sm:flex-row items-stretch">
        <div className="flex-1">
          <label
            htmlFor="url"
            className="block text-sm font-medium text-gray-700"
          >
            URL
          </label>
          <div className="flex">
            <input
              type="text"
              id="url"
              className="mt-1 block w-full p-1 border border-gray-300 rounded-md"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL"
            />
            <button
              className="bg-blue-500 text-white rounded-md p-1 mt-4 sm:mt-0 ml-0 sm:ml-4 w-full sm:w-auto"
              onClick={handleFetchContent}
            >
              Fetch Content
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrlInput;
