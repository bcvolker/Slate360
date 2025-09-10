'use client';

import { useState } from 'react';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { ContextualToolbar } from '@/components/ui/ContextualToolbar';
import { Play, Pause, RotateCcw, Maximize } from 'lucide-react';

interface UnifiedViewerProps {
  title: string;
  type: 'image' | 'video' | 'model' | 'document';
  src: string;
  className?: string;
}

export function UnifiedViewer({ title, type, src, className }: UnifiedViewerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const tools = [
    {
      label: isPlaying ? 'Pause' : 'Play',
      action: () => setIsPlaying(!isPlaying),
      helpText: isPlaying ? 'Pause content' : 'Play content',
      icon: isPlaying ? Pause : Play
    },
    {
      label: 'Reset',
      action: () => setIsPlaying(false),
      helpText: 'Reset to beginning',
      icon: RotateCcw
    },
    {
      label: 'Fullscreen',
      action: () => setIsFullscreen(!isFullscreen),
      helpText: 'Toggle fullscreen',
      icon: Maximize
    }
  ];

  return (
    <SurfaceCard className={className}>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        
        <div className="relative bg-muted rounded-lg overflow-hidden mb-4">
          {type === 'image' && (
            <img 
              src={src} 
              alt={title}
              className="w-full h-64 object-cover"
            />
          )}
          {type === 'video' && (
            <video 
              src={src}
              className="w-full h-64 object-cover"
              controls={isPlaying}
            />
          )}
          {type === 'model' && (
            <div className="w-full h-64 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
              <div className="text-center">
                <div className="text-4xl mb-2">🏗️</div>
                <p>3D Model Viewer</p>
                <p className="text-sm opacity-75">{title}</p>
              </div>
            </div>
          )}
          {type === 'document' && (
            <div className="w-full h-64 bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-white">
              <div className="text-center">
                <div className="text-4xl mb-2">📄</div>
                <p>Document Viewer</p>
                <p className="text-sm opacity-75">{title}</p>
              </div>
            </div>
          )}
        </div>

        <ContextualToolbar tools={tools} />
      </div>
    </SurfaceCard>
  );
}
