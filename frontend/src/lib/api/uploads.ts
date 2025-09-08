import { TileContent, UploadType } from '@/types';

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';

export const getTileContent = async (): Promise<TileContent[]> => {
  if (USE_MOCKS) {
    return [
      { id: '1', tileNumber: 1, type: 'model', url: '/mock/hero-model.glb', title: 'Hero 3D' },
      { id: '2', tileNumber: 2, type: 'video', url: '/mock/demo.mp4', title: 'Demo Video' },
      { id: '3', tileNumber: 3, type: 'tour', url: '/mock/tour.html', title: '360 Tour' },
      { id: '4', tileNumber: 4, type: 'image', url: 'https://images.unsplash.com/photo-1529429617124-95b109e86f1c', title: 'Preview Image' },
      { id: '5', tileNumber: 5, type: 'model', url: '/mock/building.glb', title: 'Building Model' },
      { id: '6', tileNumber: 6, type: 'video', url: '/mock/walkthrough.mp4', title: 'Walkthrough' },
    ];
  }
  throw new Error('Uploads API not implemented yet.');
};

export const uploadTileContent = async (
  tileNumber: number,
  file: File,
  type: UploadType
): Promise<TileContent> => {
  if (USE_MOCKS) {
    return {
      id: Date.now().toString(),
      tileNumber,
      type,
      url: URL.createObjectURL(file),
      title: file.name,
    };
  }
  throw new Error('Uploads API not implemented yet.');
};

export const deleteTileContent = async (id: string): Promise<void> => {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 300));
    return;
  }
  throw new Error('Uploads API not implemented yet.');
};
