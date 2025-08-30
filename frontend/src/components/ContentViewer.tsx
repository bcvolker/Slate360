import React from 'react';

interface ContentViewerProps {
  type: 'image' | 'video' | '3d' | '360';
  url?: string;
}

const ContentViewer: React.FC<ContentViewerProps> = ({ type, url }) => {
  return (
    <div className="slate360-content-tile">
      {url ? (
        <div className="slate360-content-active">
          Rendering {type} from {url}
        </div>
      ) : (
        <div className="slate360-content-placeholder">
          <p className="slate360-content-title">Content Coming Soon</p>
          <p className="slate360-content-subtitle">
            {type.toUpperCase()} content will be displayed here
          </p>
        </div>
      )}
    </div>
  );
};

export default ContentViewer;
