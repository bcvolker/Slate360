'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Video, 
  Image, 
  FileText, 
  Globe, 
  Settings,
  Eye,
  Edit,
  Trash2,
  Plus,
  Save,
  X
} from 'lucide-react';

interface ContentItem {
  id: string;
  type: 'video' | 'image' | '360-tour' | 'document';
  title: string;
  description: string;
  url: string;
  tile: string;
  uploadedAt: string;
}

const mockContent: ContentItem[] = [
  {
    id: '1',
    type: 'video',
    title: 'SLATE360 Platform Demo',
    description: 'Main platform demonstration video',
    url: '/uploads/demo-video.mp4',
    tile: 'slate360',
    uploadedAt: '2024-01-15'
  },
  {
    id: '2',
    type: 'image',
    title: 'Project Dashboard Screenshot',
    description: 'Screenshot of the project management interface',
    url: '/uploads/dashboard-screenshot.png',
    tile: 'project-hub',
    uploadedAt: '2024-01-14'
  },
  {
    id: '3',
    type: '360-tour',
    title: 'Construction Site Tour',
    description: '360° virtual tour of a construction site',
    url: '/uploads/site-tour.html',
    tile: '360-tour-builder',
    uploadedAt: '2024-01-13'
  }
];

const tiles = [
  { id: 'slate360', name: 'SLATE360 Platform' },
  { id: 'project-hub', name: 'Project Hub' },
  { id: 'bim-studio', name: 'BIM Studio' },
  { id: '360-tour-builder', name: '360° Tour Builder' },
  { id: 'content-creation', name: 'Content Creation' },
  { id: 'geospatial-robotics', name: 'Geospatial & Robotics' },
  { id: 'reports-analytics', name: 'Reports & Analytics' }
];

export default function CEODashboard() {
  const [content, setContent] = useState<ContentItem[]>(mockContent);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [newContent, setNewContent] = useState({
    type: 'video' as ContentItem['type'],
    title: '',
    description: '',
    tile: 'slate360'
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: ContentItem = {
      id: Date.now().toString(),
      ...newContent,
      url: `/uploads/${newContent.title.toLowerCase().replace(/\s+/g, '-')}.${newContent.type === 'video' ? 'mp4' : newContent.type === 'image' ? 'png' : 'html'}`,
      uploadedAt: new Date().toISOString().split('T')[0]
    };
    setContent([...content, newItem]);
    setNewContent({ type: 'video', title: '', description: '', tile: 'slate360' });
    setIsUploadModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setContent(content.filter(item => item.id !== id));
  };

  const getTypeIcon = (type: ContentItem['type']) => {
    switch (type) {
      case 'video': return <Video className="w-5 h-5" />;
      case 'image': return <Image className="w-5 h-5" />;
      case '360-tour': return <Globe className="w-5 h-5" />;
      case 'document': return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: ContentItem['type']) => {
    switch (type) {
      case 'video': return 'bg-red-100 text-red-600';
      case 'image': return 'bg-blue-100 text-blue-600';
      case '360-tour': return 'bg-green-100 text-green-600';
      case 'document': return 'bg-purple-100 text-purple-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">CEO Dashboard</h1>
                <p className="text-gray-600 mt-2">Manage website content and business operations</p>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Upload Content
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Video className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Content</p>
                <p className="text-2xl font-bold text-gray-900">{content.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <Video className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Videos</p>
                <p className="text-2xl font-bold text-gray-900">{content.filter(c => c.type === 'video').length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Globe className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">360° Tours</p>
                <p className="text-2xl font-bold text-gray-900">{content.filter(c => c.type === '360-tour').length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Tiles</p>
                <p className="text-2xl font-bold text-gray-900">{tiles.length}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Content Management */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Content Library</h2>
            <p className="text-gray-600 mt-1">Manage all website content and media files</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {content.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${getTypeColor(item.type)}`}>
                      {getTypeIcon(item.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500">Tile: {tiles.find(t => t.id === item.tile)?.name}</span>
                        <span className="text-xs text-gray-500">Uploaded: {item.uploadedAt}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Upload New Content</h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                <select
                  value={newContent.type}
                  onChange={(e) => setNewContent({...newContent, type: e.target.value as ContentItem['type']})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="video">Video</option>
                  <option value="image">Image</option>
                  <option value="360-tour">360° Tour</option>
                  <option value="document">Document</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newContent.title}
                  onChange={(e) => setNewContent({...newContent, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newContent.description}
                  onChange={(e) => setNewContent({...newContent, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Tile</label>
                <select
                  value={newContent.tile}
                  onChange={(e) => setNewContent({...newContent, tile: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {tiles.map(tile => (
                    <option key={tile.id} value={tile.id}>{tile.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Upload
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}