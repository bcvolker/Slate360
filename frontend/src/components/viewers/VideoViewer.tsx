'use client';
export default function VideoViewer({ url }: { url: string }) {
  return (
    <div className="w-full h-96 bg-gray-900 rounded-lg overflow-hidden">
      <video 
        src={url} 
        controls 
        className="w-full h-full object-cover"
        preload="metadata"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
