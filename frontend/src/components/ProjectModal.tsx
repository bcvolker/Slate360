import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  MapPin, 
  User, 
  Calendar, 
  DollarSign, 
  Users, 
  Tag, 
  FileText,
  Save,
  X,
  Edit3,
  Eye,
  Plus
} from 'lucide-react';
import Modal, { ModalProps } from './Modal';

// Define a simpler project interface for the modal
interface SimpleProject {
  _id: string;
  name: string;
  description?: string;
  type?: string;
  status?: string;
  location?: any;
  client?: any;
  timeline?: any;
  budget?: any;
  team?: any[];
  tags?: string[];
  metadata?: Record<string, any>;
  createdBy?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProjectModalProps extends Omit<ModalProps, 'children'> {
  project?: SimpleProject | null;
  mode: 'create' | 'edit' | 'view';
  onSave?: (project: Partial<SimpleProject>) => Promise<void>;
  onDelete?: (projectId: string) => Promise<void>;
  loading?: boolean;
}

interface ProjectFormData {
  name: string;
  description: string;
  type: string;
  status: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  client: {
    name: string;
    email: string;
    phone: string;
    company: string;
  };
  timeline: {
    startDate: string;
    endDate: string;
    estimatedDuration: number;
  };
  budget: {
    estimated: number;
    actual: number;
    currency: string;
  };
  team: Array<{
    userId: string;
    role: string;
    permissions: string[];
  }>;
  tags: string[];
  metadata: Record<string, any>;
}

const PROJECT_TYPES = [
  'residential',
  'commercial', 
  'industrial',
  'infrastructure',
  'renovation',
  'other'
];

const PROJECT_STATUSES = [
  'planning',
  'active',
  'on-hold',
  'completed',
  'cancelled'
];

const TEAM_ROLES = [
  'project_manager',
  'architect',
  'engineer',
  'designer',
  'contractor',
  'consultant'
];

const PERMISSIONS = ['read', 'write', 'admin'];

export function ProjectModal({
  project,
  mode,
  onSave,
  onDelete,
  loading = false,
  ...modalProps
}: ProjectModalProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    type: 'residential',
    status: 'planning',
    location: {
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    },
    client: {
      name: '',
      email: '',
      phone: '',
      company: ''
    },
    timeline: {
      startDate: '',
      endDate: '',
      estimatedDuration: 0
    },
    budget: {
      estimated: 0,
      actual: 0,
      currency: 'USD'
    },
    team: [],
    tags: [],
    metadata: {}
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newTag, setNewTag] = useState('');
  const [newTeamMember, setNewTeamMember] = useState({
    userId: '',
    role: 'project_manager',
    permissions: ['read']
  });

  // Initialize form data when project changes
  useEffect(() => {
    if (project && (mode === 'edit' || mode === 'view')) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        type: project.type || 'residential',
        status: project.status || 'planning',
        location: {
          address: project.location?.address || '',
          city: project.location?.city || '',
          state: project.location?.state || '',
          zipCode: project.location?.zipCode || '',
          country: project.location?.country || 'USA',
          coordinates: project.location?.coordinates
        },
        client: {
          name: project.client?.name || '',
          email: project.client?.email || '',
          phone: project.client?.phone || '',
          company: project.client?.company || ''
        },
        timeline: {
          startDate: project.timeline?.startDate ? new Date(project.timeline.startDate).toISOString().split('T')[0] : '',
          endDate: project.timeline?.endDate ? new Date(project.timeline.endDate).toISOString().split('T')[0] : '',
          estimatedDuration: project.timeline?.estimatedDuration || 0
        },
        budget: {
          estimated: project.budget?.estimated || 0,
          actual: project.budget?.actual || 0,
          currency: project.budget?.currency || 'USD'
        },
        team: (project.team || []).map(member => ({
          userId: member.userId?.toString() || '',
          role: member.role || '',
          permissions: member.permissions || []
        })),
        tags: project.tags || [],
        metadata: project.metadata || {}
      });
    }
  }, [project, mode]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev };
      const fieldPath = field.split('.');
      let current: any = newData;
      
      for (let i = 0; i < fieldPath.length - 1; i++) {
        current = current[fieldPath[i]];
      }
      
      current[fieldPath[fieldPath.length - 1]] = value;
      return newData;
    });

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.location.address.trim()) {
      newErrors['location.address'] = 'Address is required';
    }

    if (!formData.location.city.trim()) {
      newErrors['location.city'] = 'City is required';
    }

    if (!formData.location.state.trim()) {
      newErrors['location.state'] = 'State is required';
    }

    if (!formData.client.name.trim()) {
      newErrors['client.name'] = 'Client name is required';
    }

    if (!formData.client.email.trim()) {
      newErrors['client.email'] = 'Client email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.client.email)) {
      newErrors['client.email'] = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (onSave) {
      try {
        await onSave(formData as any);
        modalProps.onClose();
      } catch (error) {
        console.error('Failed to save project:', error);
      }
    }
  };

  const handleDelete = async () => {
    if (project?._id && onDelete) {
      try {
        await onDelete(project._id?.toString() || '');
        modalProps.onClose();
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addTeamMember = () => {
    if (newTeamMember.userId.trim() && newTeamMember.role) {
      setFormData(prev => ({
        ...prev,
        team: [...prev.team, { ...newTeamMember }]
      }));
      setNewTeamMember({
        userId: '',
        role: 'project_manager',
        permissions: ['read']
      });
    }
  };

  const removeTeamMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      team: prev.team.filter((_, i) => i !== index)
    }));
  };

  const togglePermission = (memberIndex: number, permission: string) => {
    setFormData(prev => ({
      ...prev,
      team: prev.team.map((member, index) => {
        if (index === memberIndex) {
          const permissions = member.permissions.includes(permission)
            ? member.permissions.filter(p => p !== permission)
            : [...member.permissions, permission];
          return { ...member, permissions };
        }
        return member;
      })
    }));
  };

  const getModalTitle = () => {
    switch (mode) {
      case 'create': return 'Create New Project';
      case 'edit': return 'Edit Project';
      case 'view': return 'Project Details';
      default: return 'Project';
    }
  };

  const getModalSize = () => {
    return mode === 'view' ? 'xl' : 'full';
  };

  return (
    <Modal
      {...modalProps}
      title={getModalTitle()}
      size={getModalSize()}
      closeOnOverlayClick={!loading}
      preventClose={loading}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Building2 className="w-5 h-5 mr-2" />
              Basic Information
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={mode === 'view'}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                } ${mode === 'view' ? 'bg-gray-50' : ''}`}
              />
              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                disabled={mode === 'view'}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                } ${mode === 'view' ? 'bg-gray-50' : ''}`}
              />
              {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  disabled={mode === 'view'}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 ${
                    mode === 'view' ? 'bg-gray-50' : ''
                  }`}
                >
                  {PROJECT_TYPES.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  disabled={mode === 'view'}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 ${
                    mode === 'view' ? 'bg-gray-50' : ''
                  }`}
                >
                  {PROJECT_STATUSES.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Location
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <input
                type="text"
                value={formData.location.address}
                onChange={(e) => handleInputChange('location.address', e.target.value)}
                disabled={mode === 'view'}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors['location.address'] ? 'border-red-500' : 'border-gray-300'
                } ${mode === 'view' ? 'bg-gray-50' : ''}`}
              />
              {errors['location.address'] && <p className="text-sm text-red-600 mt-1">{errors['location.address']}</p>}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.location.city}
                  onChange={(e) => handleInputChange('location.city', e.target.value)}
                  disabled={mode === 'view'}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors['location.city'] ? 'border-red-500' : 'border-gray-300'
                  } ${mode === 'view' ? 'bg-gray-50' : ''}`}
                />
                {errors['location.city'] && <p className="text-sm text-red-600 mt-1">{errors['location.city']}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  value={formData.location.state}
                  onChange={(e) => handleInputChange('location.state', e.target.value)}
                  disabled={mode === 'view'}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors['location.state'] ? 'border-red-500' : 'border-gray-300'
                  } ${mode === 'view' ? 'bg-gray-50' : ''}`}
                />
                {errors['location.state'] && <p className="text-sm text-red-600 mt-1">{errors['location.state']}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code
                </label>
                <input
                  type="text"
                  value={formData.location.zipCode}
                  onChange={(e) => handleInputChange('location.zipCode', e.target.value)}
                  disabled={mode === 'view'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Client Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Client Information
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Name *
              </label>
              <input
                type="text"
                value={formData.client.name}
                onChange={(e) => handleInputChange('client.name', e.target.value)}
                disabled={mode === 'view'}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors['client.name'] ? 'border-red-500' : 'border-gray-300'
                } ${mode === 'view' ? 'bg-gray-50' : ''}`}
              />
              {errors['client.name'] && <p className="text-sm text-red-600 mt-1">{errors['client.name']}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={formData.client.email}
                onChange={(e) => handleInputChange('client.email', e.target.value)}
                disabled={mode === 'view'}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors['client.email'] ? 'border-red-500' : 'border-gray-300'
                } ${mode === 'view' ? 'bg-gray-50' : ''}`}
              />
              {errors['client.email'] && <p className="text-sm text-red-600 mt-1">{errors['client.email']}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.client.phone}
                onChange={(e) => handleInputChange('client.phone', e.target.value)}
                disabled={mode === 'view'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <input
                type="text"
                value={formData.client.company}
                onChange={(e) => handleInputChange('client.company', e.target.value)}
                disabled={mode === 'view'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Timeline and Budget */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Timeline
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.timeline.startDate}
                  onChange={(e) => handleInputChange('timeline.startDate', e.target.value)}
                  disabled={mode === 'view'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.timeline.endDate}
                  onChange={(e) => handleInputChange('timeline.endDate', e.target.value)}
                  disabled={mode === 'view'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Duration (days)
              </label>
              <input
                type="number"
                value={formData.timeline.estimatedDuration}
                onChange={(e) => handleInputChange('timeline.estimatedDuration', parseInt(e.target.value) || 0)}
                disabled={mode === 'view'}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Budget
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Budget
                </label>
                <input
                  type="number"
                  value={formData.budget.estimated}
                  onChange={(e) => handleInputChange('budget.estimated', parseFloat(e.target.value) || 0)}
                  disabled={mode === 'view'}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Actual Spent
                </label>
                <input
                  type="number"
                  value={formData.budget.actual}
                  onChange={(e) => handleInputChange('budget.actual', parseFloat(e.target.value) || 0)}
                  disabled={mode === 'view'}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                value={formData.budget.currency}
                onChange={(e) => handleInputChange('budget.currency', e.target.value)}
                disabled={mode === 'view'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="CAD">CAD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Team Management */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Team Members
          </h3>
          
          {formData.team.length > 0 && (
            <div className="space-y-3">
              {formData.team.map((member, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={member.userId}
                      onChange={(e) => {
                        const newTeam = [...formData.team];
                        newTeam[index].userId = e.target.value;
                        setFormData(prev => ({ ...prev, team: newTeam }));
                      }}
                      disabled={mode === 'view'}
                      placeholder="User ID"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    
                    <select
                      value={member.role}
                      onChange={(e) => {
                        const newTeam = [...formData.team];
                        newTeam[index].role = e.target.value;
                        setFormData(prev => ({ ...prev, team: newTeam }));
                      }}
                      disabled={mode === 'view'}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {TEAM_ROLES.map(role => (
                        <option key={role} value={role}>
                          {role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </option>
                      ))}
                    </select>
                    
                    <div className="flex items-center space-x-2">
                      {PERMISSIONS.map(permission => (
                        <label key={permission} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={member.permissions.includes(permission)}
                            onChange={() => togglePermission(index, permission)}
                            disabled={mode === 'view'}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-1 text-sm text-gray-700 capitalize">{permission}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {mode !== 'view' && (
                    <button
                      type="button"
                      onClick={() => removeTeamMember(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {mode !== 'view' && (
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <input
                type="text"
                value={newTeamMember.userId}
                onChange={(e) => setNewTeamMember(prev => ({ ...prev, userId: e.target.value }))}
                placeholder="User ID"
                className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              <select
                value={newTeamMember.role}
                onChange={(e) => setNewTeamMember(prev => ({ ...prev, role: e.target.value }))}
                className="px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {TEAM_ROLES.map(role => (
                  <option key={role} value={role}>
                    {role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
              
              <button
                type="button"
                onClick={addTeamMember}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Tag className="w-5 h-5 mr-2" />
            Tags
          </h3>
          
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {tag}
                  {mode !== 'view' && (
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X size={14} />
                    </button>
                  )}
                </span>
              ))}
            </div>
          )}
          
          {mode !== 'view' && (
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
          )}
        </div>

        {/* Actions */}
        {mode !== 'view' && (
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            {mode === 'edit' && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
              >
                Delete Project
              </button>
            )}
            
            <button
              type="button"
              onClick={modalProps.onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>{mode === 'create' ? 'Create Project' : 'Save Changes'}</span>
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </Modal>
  );
}

export default ProjectModal;
