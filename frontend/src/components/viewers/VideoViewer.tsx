'use client';

import { useState, useRef } from 'react';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { ContextualToolbar } from '@/components/ui/ContextualToolbar';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

interface VideoViewerProps {
  title: string;
  src: string;
  className?: string;
}

export function VideoViewer({ title, src, className }: VideoViewerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        videoRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const tools = [
    {
      label: isPlaying ? 'Pause' : 'Play',
      action: togglePlay,
      helpText: isPlaying ? 'Pause video' : 'Play video',
      icon: isPlaying ? <Pause size={16} /> : <Play size={16} />
    },
    {
      label: isMuted ? 'Unmute' : 'Mute',
      action: toggleMute,
      helpText: isMuted ? 'Unmute video' : 'Mute video',
      icon: isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />
    },
    {
      label: 'Fullscreen',
      action: toggleFullscreen,
      helpText: 'Toggle fullscreen',
      icon: <Maximize size={16} />
    }
  ];

  return (
    <SurfaceCard className={className}>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        
        <div className="relative bg-muted rounded-lg overflow-hidden mb-4">
          <video 
            ref={videoRef}
            src={src}
            className="w-full h-64 object-cover"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        </div>

        <ContextualToolbar tools={tools} />
      </div>
    </SurfaceCard>
  );
}