'use client';
export default function TourViewer({ url }: { url: string }) {
  return (
    <div className="w-full h-96 bg-gray-900 rounded-lg overflow-hidden">
      <iframe
        src={url}
        className="w-full h-full"
        allowFullScreen
        title="360 Tour"
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    </div>
  );
}
