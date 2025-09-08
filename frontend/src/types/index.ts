export interface Project {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  status: 'In Progress' | 'Completed' | 'On Hold';
  bimModelUrl?: string;
}

export type UploadType = 'model' | 'video' | 'image' | 'tour';

export interface TileContent {
  id: string;
  tileNumber: number;
  type: UploadType;
  url: string;
  title?: string;
}
