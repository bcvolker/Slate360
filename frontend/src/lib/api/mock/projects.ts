import { Project } from '@/types';

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Downtown Tower Renovation',
    description: 'Energy-efficient retrofit of a skyscraper.',
    imageUrl: 'https://images.unsplash.com/photo-1542361389-03504433a94f',
    status: 'In Progress',
    bimModelUrl: '/mock/tower.ifc',
  },
  {
    id: '2',
    name: 'Community Center',
    description: 'New suburban multi-purpose hub.',
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
    status: 'Completed',
  },
  {
    id: '3',
    name: 'Residential Complex',
    description: 'Modern apartment building with sustainable design.',
    imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
    status: 'On Hold',
    bimModelUrl: '/mock/complex.ifc',
  },
  {
    id: '4',
    name: 'Office Park',
    description: 'Corporate headquarters with green building features.',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
    status: 'In Progress',
  },
  {
    id: '5',
    name: 'Shopping Mall',
    description: 'Retail complex with entertainment facilities.',
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
    status: 'Completed',
    bimModelUrl: '/mock/mall.ifc',
  },
];
