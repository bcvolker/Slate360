'use client';
import { useState } from 'react';
import { Upload, Video, Image, FileText, Save, Trash2 } from 'lucide-react';

interface ContentItem {
  id: string;
  type: '3d-model' | 'video' | '360-tour' | 'image';
  title: string;
  description: string;
  fileUrl?: string;
  tileId: string;
  uploadedAt: Date;
}

export default function CEODashboard() {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const tiles = [
    { id: 'slate360', name: 'SLATE360', type: '3d-model' },
    { id: 'bim-studio', name: 'BIM Studio', type: 'video' },
    { id: '360-tour-builder', name: '360° Tour Builder', type: '360-tour' },
    { id: 'content-creation', name: 'Content Creation', type: 'video' },
    { id: 'geospatial-robotics', name: 'Geospatial & Robotics', type: 'video' },
  ];

  const handleFileUpload = async (tileId: string, type: string) => {
    if (!selectedFile) return;

    setUploading(true);
    
    // Simulate file upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newContent: ContentItem = {
      id: Date.now().toString(),
      type: type as any,
      title: selectedFile.name,
      description: `Uploaded for ${tiles.find(t => t.id === tileId)?.name}`,
      fileUrl: URL.createObjectURL(selectedFile),
      tileId,
      uploadedAt: new Date()
    };

    setContentItems(prev => [...prev, newContent]);
    setSelectedFile(null);
    setUploading(false);
  };

  const deleteContent = (id: string) => {
    setContentItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">CEO Content Management</h1>
          <p className="text-gray-400">Upload and manage content for your SLATE360 homepage</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Upload Content</h2>
            
            <div className="space-y-4">
              {tiles.map(tile => (
                <div key={tile.id} className="border border-gray-700 rounded-lg p-4">
                  <h3 className="font-medium mb-2">{tile.name}</h3>
                  <p className="text-sm text-gray-400 mb-3">
                    {tile.type === '3d-model' && 'Upload 3D model files (.glb, .gltf)'}
                    {tile.type === 'video' && 'Upload video files (.mp4, .webm)'}
                    {tile.type === '360-tour' && 'Upload 360° tour files or images'}
                    {tile.type === 'image' && 'Upload image files (.jpg, .png)'}
                  </p>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      accept={
                        tile.type === '3d-model' ? '.glb,.gltf' :
                        tile.type === 'video' ? '.mp4,.webm' :
                        tile.type === '360-tour' ? '.jpg,.png,.mp4' :
                        '.jpg,.png'
                      }
                      className="flex-1 text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                    />
                    <button
                      onClick={() => handleFileUpload(tile.id, tile.type)}
                      disabled={!selectedFile || uploading}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
                    >
                      {uploading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content Library */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Content Library</h2>
            
            <div className="space-y-3">
              {contentItems.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No content uploaded yet</p>
              ) : (
                contentItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                        {item.type === '3d-model' && <FileText className="w-5 h-5" />}
                        {item.type === 'video' && <Video className="w-5 h-5" />}
                        {item.type === '360-tour' && <Image className="w-5 h-5" />}
                        {item.type === 'image' && <Image className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-gray-400">{item.description}</p>
                        <p className="text-xs text-gray-500">
                          {item.uploadedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteContent(item.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-900/20 border border-blue-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Content Guidelines</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• <strong>3D Models:</strong> Upload .glb or .gltf files for the SLATE360 hero section</li>
            <li>• <strong>Videos:</strong> Use .mp4 or .webm format, max 50MB for BIM Studio, Content Creation, and Robotics sections</li>
            <li>• <strong>360° Tours:</strong> Upload panoramic images or video files for interactive tours</li>
            <li>• <strong>Images:</strong> Use high-quality .jpg or .png files for static content</li>
            <li>• All content will be automatically optimized and displayed on the homepage</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
