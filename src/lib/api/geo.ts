const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';

export interface GeoData {
  id: string;
  projectId: string;
  latitude: number;
  longitude: number;
  address: string;
  siteArea: number;
  elevation: number;
  soilType: string;
}

export const getGeoData = async (projectId?: string): Promise<GeoData[]> => {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 500));
    return [
      {
        id: '1',
        projectId: '1',
        latitude: 40.7128,
        longitude: -74.0060,
        address: '123 Main St, New York, NY 10001',
        siteArea: 2500,
        elevation: 15.5,
        soilType: 'Clay',
      },
      {
        id: '2',
        projectId: '2',
        latitude: 34.0522,
        longitude: -118.2437,
        address: '456 Oak Ave, Los Angeles, CA 90210',
        siteArea: 1800,
        elevation: 120.0,
        soilType: 'Sandy Loam',
      },
    ];
  }
  throw new Error('Geo API not implemented yet.');
};

export const updateGeoData = async (projectId: string, geoData: Omit<GeoData, 'id' | 'projectId'>): Promise<GeoData> => {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 800));
    return {
      id: Date.now().toString(),
      projectId,
      ...geoData,
    };
  }
  throw new Error('Geo API not implemented yet.');
};
