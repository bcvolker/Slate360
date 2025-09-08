'use client';
import ModelViewer from '@/components/viewers/ModelViewer';
import VideoViewer from '@/components/viewers/VideoViewer';
import TourViewer from '@/components/viewers/TourViewer';
import ImageViewer from '@/components/viewers/ImageViewer';
import { TileContent } from '@/types';

export function Tile({ content }: { content: TileContent }) {
  switch (content.type) {
    case 'model': 
      return <ModelViewer url={content.url} />;
    case 'video': 
      return <VideoViewer url={content.url} />;
    case 'tour': 
      return <TourViewer url={content.url} />;
    case 'image': 
      return <ImageViewer url={content.url} />;
    default: 
      return (
        <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Unsupported content type: {content.type}</p>
        </div>
      );
  }
}
