import React, { useState } from 'react';
import TextInput from './components/TextInput';
import UrlInput from './components/UrlInput';
import ResultsDisplay from './components/ResultsDisplay';
import Login from './components/Login';
import LoadingSpinner from './components/LoadingSpinner';
import { getSummary } from './utils/api';
import { fetchContentFromUrl } from './utils/scraper';
import { useUser } from './context/UserContext';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

const App = () => {
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const [history, setHistory] = useState([]);
  const [section, setSection] = useState('');

  const fetchContent = async (htmlContent) => {
    setLoading(true);
    try {
      const fetchedContent = await fetchContentFromUrl(htmlContent);
      setContent(fetchedContent);
    } catch (error) {
      console.error(error.message);
      toast.error('Error while fetching content.');
    }
    setLoading(false);
  };

  const generateSummary = async (length) => {
    setLoading(true);
    try {
      const summaryText = await getSummary(content, length);
      setSummary(summaryText);
      setHistory([...history, { content, summary: summaryText }]);
    } catch (error) {
      console.error(error.message);
      toast.error('Error while generating summary.');
    }
    setLoading(false);
  };

  const exportSummary = (format) => {
    if (format === 'text') {
      const blob = new Blob([summary], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, 'summary.txt');
    } else if (format === 'pdf') {
      const doc = new jsPDF();
      doc.text(summary, 10, 10); // Write summary content to the PDF
      doc.save('summary.pdf'); // Save the PDF file
    }
  };

  const toggleExpandContent = (index) => {
    const updatedHistory = history.map((item, idx) => {
      if (idx === index) {
        return {
          ...item,
          expanded: !item.expanded,
        };
      }
      return item;
    });
    setHistory(updatedHistory);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">
        AI-Powered Content Summarizer
      </h1>
      <ToastContainer />
      {user ? (
        <>
          <p className="text-center mb-4">Welcome, {user.username}</p>
          <UrlInput url={url} setUrl={setUrl} fetchContent={fetchContent} />
          <div className="mb-4">
            <label
              htmlFor="section"
              className="block text-sm font-medium text-gray-700"
            >
              Section to Scrape (optional): eg. Like the id, class of a
              particular section which you want to scrap for the above specified
              URL
            </label>
            <input
              type="text"
              id="section"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              placeholder="e.g., #main-content"
              value={section}
              onChange={(e) => setSection(e.target.value)}
            />
          </div>
          <TextInput content={content} setContent={setContent} />
          <div className="mt-4 flex justify-center space-x-2">
            <button
              className="p-2 bg-green-500 text-white rounded-md"
              onClick={() => generateSummary('short')}
            >
              Short Summary
            </button>
            <button
              className="p-2 bg-yellow-500 text-white rounded-md"
              onClick={() => generateSummary('medium')}
            >
              Medium Summary
            </button>
            <button
              className="p-2 bg-red-500 text-white rounded-md"
              onClick={() => generateSummary('long')}
            >
              Long Summary
            </button>
          </div>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <h2 className="text-xl font-bold mt-4">Content Preview</h2>
              <div
                className="mt-2 p-2 border rounded-md overflow-auto"
                style={{ maxHeight: '400px' }}
              >
                {content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
              <ResultsDisplay original={content} summary={summary} />
              <div className="mt-4 flex justify-center space-x-2">
                <button
                  className="p-2 bg-blue-500 text-white rounded-md"
                  onClick={() => exportSummary('text')}
                >
                  Export as Text
                </button>
                <button
                  className="p-2 bg-blue-500 text-white rounded-md"
                  onClick={() => exportSummary('pdf')}
                >
                  Export as PDF
                </button>
              </div>
            </>
          )}
          <h2 className="text-xl font-bold mt-4">History</h2>
          <ul>
            {history.map((item, index) => (
              <li key={index} className="p-2 border-b">
                <p>
                  <strong>Content:</strong>{' '}
                  {item.content.split(' ').length > 100 && !item.expanded
                    ? `${item.content.split(' ').slice(0, 100).join(' ')} ... `
                    : item.content}
                  {item.content.split(' ').length > 100 && (
                    <button
                      className="text-blue-500 ml-2 hover:underline"
                      onClick={() => toggleExpandContent(index)}
                    >
                      {item.expanded ? 'Read Less' : 'Read More'}
                    </button>
                  )}
                </p>
                <p>
                  <strong>Summary:</strong> {item.summary}
                </p>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default App;
