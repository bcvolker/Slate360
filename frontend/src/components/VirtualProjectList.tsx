import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Eye, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { IProject } from '@/models/Project';

interface VirtualProjectListProps {
  projects: IProject[];
  itemHeight?: number;
  containerHeight?: number;
  onProjectClick?: (project: IProject) => void;
  onEditProject?: (project: IProject) => void;
  onDeleteProject?: (project: IProject) => void;
  onViewProject?: (project: IProject) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  showActions?: boolean;
  searchTerm?: string;
  filters?: {
    status?: string;
    type?: string;
    client?: string;
  };
}

interface VirtualItem {
  index: number;
  project: IProject;
  top: number;
  height: number;
}

export function VirtualProjectList({
  projects,
  itemHeight = 80,
  containerHeight = 600,
  onProjectClick,
  onEditProject,
  onDeleteProject,
  onViewProject,
  loading = false,
  emptyMessage = 'No projects found',
  className = '',
  showActions = true,
  searchTerm = '',
  filters = {}
}: VirtualProjectListProps) {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());

  // Filter and search projects
  const filteredProjects = useMemo(() => {
    let filtered = projects;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower) ||
        project.client.name.toLowerCase().includes(searchLower) ||
        project.client.company?.toLowerCase().includes(searchLower) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(project => project.status === filters.status);
    }

    // Apply type filter
    if (filters.type) {
      filtered = filtered.filter(project => project.type === filters.type);
    }

    // Apply client filter
    if (filters.client) {
      filtered = filtered.filter(project =>
        project.client.name.toLowerCase().includes(filters.client!.toLowerCase()) ||
        project.client.company?.toLowerCase().includes(filters.client!.toLowerCase())
      );
    }

    return filtered;
  }, [projects, searchTerm, filters]);

  // Calculate virtual items
  const virtualItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      filteredProjects.length
    );

    const items: VirtualItem[] = [];
    for (let i = startIndex; i < endIndex; i++) {
      items.push({
        index: i,
        project: filteredProjects[i],
        top: i * itemHeight,
        height: itemHeight
      });
    }

    return items;
  }, [scrollTop, containerHeight, itemHeight, filteredProjects]);

  // Handle scroll
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  // Toggle project expansion
  const toggleExpansion = useCallback((projectId: string) => {
    setExpandedProjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  }, []);

  // Handle project selection
  const handleProjectClick = useCallback((project: IProject) => {
    setSelectedProject(project._id?.toString() || null);
    onProjectClick?.(project);
  }, [onProjectClick]);

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get type color
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'residential': return 'bg-purple-100 text-purple-800';
      case 'commercial': return 'bg-indigo-100 text-indigo-800';
      case 'industrial': return 'bg-orange-100 text-orange-800';
      case 'infrastructure': return 'bg-teal-100 text-teal-800';
      case 'renovation': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate total height for scrollbar
  const totalHeight = filteredProjects.length * itemHeight;

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (filteredProjects.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center h-64 text-gray-500 ${className}`}>
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Eye size={24} />
        </div>
        <p className="text-lg font-medium">{emptyMessage}</p>
        {searchTerm && (
          <p className="text-sm text-gray-400 mt-2">
            No projects match "{searchTerm}"
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Virtual List Container */}
      <div
        ref={setContainerRef}
        className="overflow-auto border border-gray-200 rounded-lg"
        style={{ height: containerHeight }}
        onScroll={handleScroll}
      >
        {/* Scrollable content with proper height */}
        <div style={{ height: totalHeight, position: 'relative' }}>
          {/* Virtual items */}
          <AnimatePresence>
            {virtualItems.map(({ index, project, top, height }) => (
              <motion.div
                key={project._id?.toString() || index}
                className="absolute left-0 right-0"
                style={{ top, height }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <ProjectListItem
                  project={project}
                  isSelected={selectedProject === project._id}
                  isExpanded={expandedProjects.has(project._id?.toString() || '')}
                  onToggleExpansion={() => toggleExpansion(project._id?.toString() || '')}
                  onClick={() => handleProjectClick(project)}
                  onEdit={() => onEditProject?.(project)}
                  onDelete={() => onDeleteProject?.(project)}
                  onView={() => onViewProject?.(project)}
                  showActions={showActions}
                  getStatusColor={getStatusColor}
                  getTypeColor={getTypeColor}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Scroll indicator */}
      {filteredProjects.length > Math.ceil(containerHeight / itemHeight) && (
        <div className="absolute bottom-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
          {Math.floor(scrollTop / itemHeight) + 1} - {Math.min(Math.floor(scrollTop / itemHeight) + Math.ceil(containerHeight / itemHeight), filteredProjects.length)} of {filteredProjects.length}
        </div>
      )}
    </div>
  );
}

// Individual project list item component
interface ProjectListItemProps {
  project: IProject;
  isSelected: boolean;
  isExpanded: boolean;
  onToggleExpansion: () => void;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
  showActions: boolean;
  getStatusColor: (status: string) => string;
  getTypeColor: (type: string) => string;
}

function ProjectListItem({
  project,
  isSelected,
  isExpanded,
  onToggleExpansion,
  onClick,
  onEdit,
  onDelete,
  onView,
  showActions,
  getStatusColor,
  getTypeColor
}: ProjectListItemProps) {
  return (
    <div
      className={`
        border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer
        ${isSelected ? 'bg-blue-50 border-blue-200' : ''}
      `}
      onClick={onClick}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpansion();
              }}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight size={16} className="text-gray-500" />
              </motion.div>
            </button>
            
            <h3 className="font-medium text-gray-900 truncate flex-1">
              {project.name}
            </h3>
          </div>

          {/* Status and Type badges */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(project.type)}`}>
              {project.type}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {project.description}
        </p>

        {/* Client and Location */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-4">
            <span>Client: {project.client.name}</span>
            <span>Location: {project.location.city}, {project.location.state}</span>
          </div>
          
          {project.budget?.estimated && (
            <span className="font-medium text-gray-700">
              ${project.budget.estimated.toLocaleString()}
            </span>
          )}
        </div>

        {/* Expanded content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-3 border-t border-gray-100 space-y-3">
                {/* Timeline */}
                {project.timeline && (
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Timeline: </span>
                    {project.timeline.startDate && (
                      <span>Start: {new Date(project.timeline.startDate).toLocaleDateString()}</span>
                    )}
                    {project.timeline.endDate && (
                      <span className="ml-2">End: {new Date(project.timeline.endDate).toLocaleDateString()}</span>
                    )}
                  </div>
                )}

                {/* Team */}
                {project.team && project.team.length > 0 && (
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Team: </span>
                    <span>{project.team.length} member(s)</span>
                  </div>
                )}

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Tags: </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        {showActions && (
          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView();
              }}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="View project"
            >
              <Eye size={16} />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
              title="Edit project"
            >
              <Edit size={16} />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Delete project"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default VirtualProjectList;
