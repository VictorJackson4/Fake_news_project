
import React, { useState } from 'react';
import { FileContent } from '../types';

interface CodeEditorProps {
  file: FileContent;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ file }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(file.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold uppercase">
            {file.language}
          </span>
          <span className="font-mono text-sm font-semibold text-gray-700">{file.name}</span>
        </div>
        <button 
          onClick={handleCopy}
          className="text-xs flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors"
        >
          {copied ? (
            <><i className="fa-solid fa-check"></i> Copied!</>
          ) : (
            <><i className="fa-solid fa-copy"></i> Copy Code</>
          )}
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4 bg-[#1E1E1E] text-gray-300 font-mono text-sm leading-relaxed">
        <pre className="whitespace-pre">
          <code>{file.content}</code>
        </pre>
      </div>
      <div className="px-4 py-3 bg-blue-50 border-t border-blue-100 text-blue-800 text-sm italic">
        <strong>Tip:</strong> {file.description}
      </div>
    </div>
  );
};

export default CodeEditor;
