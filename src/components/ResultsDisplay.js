import React from 'react';

const ResultsDisplay = ({ original, summary }) => (
  <div className="mt-4 grid grid-cols-2 gap-4">
    <div>
      <h2 className="text-xl font-semibold">Original Text</h2>
      <p
        className="p-2 border rounded-md overflow-auto"
        style={{ maxHeight: '400px' }}
      >
        {original}
      </p>
    </div>
    <div>
      <h2 className="text-xl font-semibold">Summary</h2>
      <p className="p-2 border rounded-md">{summary}</p>
    </div>
  </div>
);

export default ResultsDisplay;
