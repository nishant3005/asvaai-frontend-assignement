import React from 'react';

const TextInput = ({ content, setContent }) => (
  <div className="mt-4">
    <textarea
      className="w-full p-2 border rounded-md"
      rows="6"
      placeholder="Enter text"
      value={content}
      onChange={(e) => setContent(e.target.value)}
    />
  </div>
);

export default TextInput;
