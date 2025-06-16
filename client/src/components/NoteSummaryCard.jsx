import React from 'react';
import { Button } from '@/components/ui/button';

const NoteSummaryCard = ({ summary, onCopy }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 mt-4">
      <h2 className="text-xl font-semibold mb-2">Note Summary</h2>
      <p className="text-gray-700 whitespace-pre-line">{summary}</p>
      <Button className="mt-4" onClick={onCopy}>Copy to Clipboard</Button>
    </div>
  );
};

export default NoteSummaryCard;
