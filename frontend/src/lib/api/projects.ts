import { Project } from '@/types';
import { mockProjects } from './mock/projects';

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';

export const getProjects = async (): Promise<Project[]> => {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 500));
    return mockProjects;
  }
  throw new Error('Real API not implemented yet.');
};

export const getProject = async (id: string): Promise<Project | null> => {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 300));
    return mockProjects.find(p => p.id === id) || null;
  }
  throw new Error('Real API not implemented yet.');
};

export const createProject = async (project: Omit<Project, 'id'>): Promise<Project> => {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 800));
    return {
      id: Date.now().toString(),
      ...project,
    };
  }
  throw new Error('Real API not implemented yet.');
};

export const updateProject = async (id: string, updates: Partial<Project>): Promise<Project> => {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 600));
    const project = mockProjects.find(p => p.id === id);
    if (!project) throw new Error('Project not found');
    return { ...project, ...updates };
  }
  throw new Error('Real API not implemented yet.');
};

export const deleteProject = async (id: string): Promise<void> => {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 400));
    return;
  }
  throw new Error('Real API not implemented yet.');
};
