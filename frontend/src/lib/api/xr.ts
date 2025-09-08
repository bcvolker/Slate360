const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';

export interface XRSession {
  id: string;
  projectId: string;
  sessionName: string;
  participants: number;
  duration: number;
  startedAt: string;
  endedAt?: string;
  status: 'active' | 'completed' | 'cancelled';
}

export const getXRSessions = async (projectId?: string): Promise<XRSession[]> => {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 400));
    return [
      {
        id: '1',
        projectId: '1',
        sessionName: 'Design Review Meeting',
        participants: 5,
        duration: 45,
        startedAt: '2024-01-15T10:00:00Z',
        endedAt: '2024-01-15T10:45:00Z',
        status: 'completed',
      },
      {
        id: '2',
        projectId: '1',
        sessionName: 'Client Presentation',
        participants: 8,
        duration: 30,
        startedAt: '2024-01-16T14:00:00Z',
        status: 'active',
      },
    ];
  }
  throw new Error('XR API not implemented yet.');
};

export const createXRSession = async (projectId: string, sessionData: Omit<XRSession, 'id' | 'projectId' | 'startedAt' | 'status'>): Promise<XRSession> => {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 1000));
    return {
      id: Date.now().toString(),
      projectId,
      startedAt: new Date().toISOString(),
      status: 'active',
      ...sessionData,
    };
  }
  throw new Error('XR API not implemented yet.');
};
