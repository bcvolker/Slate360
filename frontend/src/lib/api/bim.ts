const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';

export interface BIMModel {
  id: string;
  name: string;
  projectId: string;
  fileUrl: string;
  fileSize: number;
  lastModified: string;
  version: string;
}

export const getBIMModels = async (projectId?: string): Promise<BIMModel[]> => {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 500));
    return [
      {
        id: '1',
        name: 'Main Building Model',
        projectId: '1',
        fileUrl: '/mock/tower.ifc',
        fileSize: 15728640,
        lastModified: '2024-01-15T10:30:00Z',
        version: '2.1',
      },
      {
        id: '2',
        name: 'Structural Model',
        projectId: '1',
        fileUrl: '/mock/tower-structure.ifc',
        fileSize: 8388608,
        lastModified: '2024-01-14T15:45:00Z',
        version: '1.8',
      },
    ];
  }
  throw new Error('BIM API not implemented yet.');
};

export const uploadBIMModel = async (projectId: string, file: File): Promise<BIMModel> => {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 2000));
    return {
      id: Date.now().toString(),
      name: file.name,
      projectId,
      fileUrl: URL.createObjectURL(file),
      fileSize: file.size,
      lastModified: new Date().toISOString(),
      version: '1.0',
    };
  }
  throw new Error('BIM API not implemented yet.');
};
