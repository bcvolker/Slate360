const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';

export interface ContentItem {
  id: string;
  title: string;
  type: 'document' | 'image' | 'video' | 'presentation';
  url: string;
  projectId?: string;
  uploadedAt: string;
  fileSize: number;
}

export const getContent = async (projectId?: string): Promise<ContentItem[]> => {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 300));
    return [
      {
        id: '1',
        title: 'Project Specifications',
        type: 'document',
        url: '/mock/specs.pdf',
        projectId: '1',
        uploadedAt: '2024-01-08T11:20:00Z',
        fileSize: 2048576,
      },
      {
        id: '2',
        title: 'Site Photos',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1542361389-03504433a94f',
        projectId: '1',
        uploadedAt: '2024-01-09T16:45:00Z',
        fileSize: 3145728,
      },
    ];
  }
  throw new Error('Content API not implemented yet.');
};

export const uploadContent = async (projectId: string, file: File): Promise<ContentItem> => {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 1000));
    return {
      id: Date.now().toString(),
      title: file.name,
      type: file.type.startsWith('image/') ? 'image' : 
            file.type.startsWith('video/') ? 'video' :
            file.type.includes('pdf') ? 'document' : 'document',
      url: URL.createObjectURL(file),
      projectId,
      uploadedAt: new Date().toISOString(),
      fileSize: file.size,
    };
  }
  throw new Error('Content API not implemented yet.');
};
