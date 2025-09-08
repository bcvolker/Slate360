'use client';
import { useState, useEffect } from 'react';
import { uploadTileContent, getTileContent, deleteTileContent } from '@/lib/api/uploads';
import { TileContent, UploadType } from '@/types';

export default function CeoDashboard() {
  const [tileContent, setTileContent] = useState<TileContent[]>([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTileContent();
  }, []);

  const loadTileContent = async () => {
    try {
      const content = await getTileContent();
      setTileContent(content);
    } catch (error) {
      setStatus('Error loading tile content');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (
    tileNumber: number,
    type: UploadType,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files?.length) return;
    setStatus('Uploading...');
    try {
      const file = e.target.files[0];
      const result = await uploadTileContent(tileNumber, file, type);
      setTileContent(prev => [...prev.filter(t => t.tileNumber !== tileNumber), result]);
      setStatus(`Uploaded ${result.title} to tile ${tileNumber}`);
    } catch (error) {
      setStatus('Upload failed');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTileContent(id);
      setTileContent(prev => prev.filter(t => t.id !== id));
      setStatus('Tile content deleted');
    } catch (error) {
      setStatus('Delete failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">CEO Dashboard</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">CEO Dashboard</h1>
        <p className="text-gray-600 mb-8">Manage homepage tiles by uploading new content</p>
        
        {status && (
          <div className="mb-6 p-4 bg-blue-100 border border-blue-300 rounded-lg">
            <p className="text-blue-800">{status}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(tile => {
            const currentContent = tileContent.find(t => t.tileNumber === tile);
            return (
              <div key={tile} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Tile {tile}</h2>
                
                {currentContent && (
                  <div className="mb-4 p-3 bg-gray-100 rounded">
                    <p className="text-sm text-gray-600">Current: {currentContent.title}</p>
                    <p className="text-xs text-gray-500">Type: {currentContent.type}</p>
                    <button
                      onClick={() => handleDelete(currentContent.id)}
                      className="mt-2 text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      3D Model (.glb, .gltf)
                    </label>
                    <input
                      type="file"
                      accept=".glb,.gltf"
                      onChange={(e) => handleUpload(tile, 'model', e)}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Video (.mp4, .webm)
                    </label>
                    <input
                      type="file"
                      accept=".mp4,.webm"
                      onChange={(e) => handleUpload(tile, 'video', e)}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image (.jpg, .png, .webp)
                    </label>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={(e) => handleUpload(tile, 'image', e)}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      360 Tour (.html)
                    </label>
                    <input
                      type="file"
                      accept=".html"
                      onChange={(e) => handleUpload(tile, 'tour', e)}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}