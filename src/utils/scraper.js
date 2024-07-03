import axios from 'axios';
import { toast } from 'react-toastify';

const cleanContent = (content) => {
  // Remove citation numbers (e.g., [1], [2])
  content = content.replace(/\[\d+\]/g, '');

  // Remove non-English text (simple heuristic, more complex language detection can be added)
  content = content.replace(/[\u00C0-\u024F\u1E00-\u1EFF]/g, '');

  // Normalize whitespace and ensure paragraphs are separated
  content = content.replace(/\s+/g, ' ').trim();
  content = content.replace(/(\.)([A-Z])/g, '$1\n\n$2'); // Add paragraph breaks

  return content;
};

export const fetchContentFromUrl = async (htmlContent, section) => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    let extractedContent = '';

    if (section) {
      // Extract specific section
      const sectionElement = doc.querySelector(section);
      if (sectionElement) {
        extractedContent = sectionElement.innerText;
      }
    } else {
      // Extract all <p> tags
      const paragraphs = doc.querySelectorAll('p');
      paragraphs.forEach((p) => {
        extractedContent += `${p.innerText}\n\n`;
      });
    }

    return cleanContent(extractedContent);
  } catch (error) {
    toast.error('Error fetching content.');
    console.error('Error fetching content:', error);
    throw new Error('Failed to fetch content');
  }
};
