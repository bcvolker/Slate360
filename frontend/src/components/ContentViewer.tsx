import React from 'react';

interface ContentViewerProps {
  type?: 'image' | 'video' | '3d' | '360';
  title: string;
  url?: string;
}

export default function ContentViewer({ type, title, url }: ContentViewerProps) {
  return (
    <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      {url ? <div>Rendering {type} content...</div> : <p className="text-gray-400">Content Coming Soon</p>}
    </div>
  );
}
