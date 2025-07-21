import React, { useEffect, useRef } from 'react';
import { XMarkIcon, PlayIcon, CurrencyDollarIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
=======
import Image from 'next/image';
import { XIcon, PlayIcon, CurrencyDollarIcon, ShoppingCartIcon } from '@heroicons/react/outline';


// Project data interface
export interface Project {
  id: string;
  name: string;
  description: string;
  location: string;
  healthScore: number; // 0-100 from ML model
  predictedCO2Offset: number; // tons per year
  imageUrl?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  metrics: {
    totalArea: number; // hectares
    treesPlanted?: number;
    startDate: string;
    projectType: 'reforestation' | 'conservation' | 'renewable' | 'restoration';
  };
  investment: {
    targetAmount: number;
    currentAmount: number;
    tokenPrice: number; // price per carbon credit token
    availableTokens: number;
  };
}

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onInvest: (project: Project) => void;
  onBuyToken: (project: Project) => void;
  onViewTimelapse: (project: Project) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  isOpen,
  onClose,
  onInvest,
  onBuyToken,
  onViewTimelapse,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableElementRef = useRef<HTMLButtonElement>(null);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
=======
    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          event.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          event.preventDefault();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('keydown', handleTabKey);
      document.body.style.overflow = 'hidden';
      
      // Focus the first focusable element
      setTimeout(() => {
        firstFocusableElementRef.current?.focus();
      }, 100);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
=======
      document.removeEventListener('keydown', handleTabKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle click outside modal
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Focus trap for accessibility
  const handleTabKey = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return;

    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (!focusableElements || focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        event.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        event.preventDefault();
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleTabKey);
    }
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

=======
  if (!isOpen || !project) return null;

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  const getHealthScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  const progressPercentage = (project.investment.currentAmount / project.investment.targetAmount) * 100;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div
        ref={modalRef}
        className="bg-base-100 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-base-300">
          <div className="flex-1">
            <h2 id="modal-title" className="text-2xl font-bold text-base-content mb-2">
              {project.name}
            </h2>
            <p className="text-sm text-base-content opacity-70">
              📍 {project.location}
            </p>
          </div>
          <button
            ref={firstFocusableElementRef}
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle ml-4"
            aria-label="Close modal"
          >
            <XMarkIcon className="h-5 w-5" />
=======
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Project Image */}
          {project.imageUrl && (
            <div className="w-full h-48 md:h-64 rounded-lg overflow-hidden">
              <img
                src={project.imageUrl}
                alt={`${project.name} project site`}
                className="w-full h-full object-cover"
=======
            <div className="w-full h-48 md:h-64 rounded-lg overflow-hidden relative">
              <Image
                src={project.imageUrl}
                alt={`${project.name} project site`}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-base-content mb-3">Project Description</h3>
            <p id="modal-description" className="text-base-content opacity-80 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Health Score */}
            <div className="bg-base-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-base-content opacity-70 mb-2">
                Health Score (ML Model)
              </h4>
              <div className="flex items-center space-x-2">
                <div className={`text-2xl font-bold ${getHealthScoreColor(project.healthScore)}`}>
                  {project.healthScore}
                </div>
                <div className="text-sm">
                  <div className={`font-medium ${getHealthScoreColor(project.healthScore)}`}>
                    {getHealthScoreLabel(project.healthScore)}
                  </div>
                  <div className="text-base-content opacity-50">/ 100</div>
                </div>
              </div>
              <div className="w-full bg-base-300 rounded-full h-2 mt-2">
                <div
                  className={`h-2 rounded-full ${
                    project.healthScore >= 80 ? 'bg-success' :
                    project.healthScore >= 60 ? 'bg-warning' : 'bg-error'
                  }`}
                  style={{ width: `${project.healthScore}%` }}
                ></div>
              </div>
            </div>

            {/* CO₂ Offset */}
            <div className="bg-base-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-base-content opacity-70 mb-2">
                Predicted CO₂ Offset
              </h4>
              <div className="text-2xl font-bold text-success">
                {project.predictedCO2Offset.toLocaleString()}
              </div>
              <div className="text-sm text-base-content opacity-70">tons/year</div>
            </div>

            {/* Project Area */}
            <div className="bg-base-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-base-content opacity-70 mb-2">
                Project Area
              </h4>
              <div className="text-2xl font-bold text-primary">
                {project.metrics.totalArea.toLocaleString()}
              </div>
              <div className="text-sm text-base-content opacity-70">hectares</div>
            </div>

            {/* Trees Planted */}
            {project.metrics.treesPlanted && (
              <div className="bg-base-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-base-content opacity-70 mb-2">
                  Trees Planted
                </h4>
                <div className="text-2xl font-bold text-accent">
                  {project.metrics.treesPlanted.toLocaleString()}
                </div>
                <div className="text-sm text-base-content opacity-70">trees</div>
              </div>
            )}
          </div>

          {/* Investment Progress */}
          <div className="bg-base-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-base-content mb-3">Investment Progress</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-base-content opacity-70">Funding Progress</span>
                <span className="text-sm font-medium">
                  ${project.investment.currentAmount.toLocaleString()} / 
                  ${project.investment.targetAmount.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-base-300 rounded-full h-3">
                <div
                  className="bg-primary h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                ></div>
              </div>
              <div className="text-right text-sm font-medium text-primary">
                {progressPercentage.toFixed(1)}% funded
              </div>
            </div>
          </div>

          {/* Token Information */}
          <div className="bg-base-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-base-content mb-3">Carbon Credit Tokens</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-base-content opacity-70">Token Price</div>
                <div className="text-xl font-bold text-secondary">
                  ${project.investment.tokenPrice}
                </div>
                <div className="text-xs text-base-content opacity-50">per carbon credit</div>
              </div>
              <div>
                <div className="text-sm text-base-content opacity-70">Available Tokens</div>
                <div className="text-xl font-bold text-secondary">
                  {project.investment.availableTokens.toLocaleString()}
                </div>
                <div className="text-xs text-base-content opacity-50">carbon credits</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={() => onInvest(project)}
              className="btn btn-primary flex-1 gap-2"
              aria-label={`Invest in ${project.name} project`}
            >
              <CurrencyDollarIcon className="h-5 w-5" />
              Invest
            </button>
            <button
              onClick={() => onBuyToken(project)}
              className="btn btn-secondary flex-1 gap-2"
              aria-label={`Buy carbon credit tokens for ${project.name}`}
            >
              <ShoppingCartIcon className="h-5 w-5" />
              Buy Token
            </button>
            <button
              onClick={() => onViewTimelapse(project)}
              className="btn btn-accent flex-1 gap-2"
              aria-label={`View timelapse for ${project.name} project`}
            >
              <PlayIcon className="h-5 w-5" />
              View Timelapse
            </button>
          </div>

          {/* Project Details */}
          <div className="border-t border-base-300 pt-4">
            <h3 className="text-lg font-semibold text-base-content mb-3">Project Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-base-content opacity-70">Project Type:</span>
                <span className="ml-2 capitalize">{project.metrics.projectType}</span>
              </div>
              <div>
                <span className="font-medium text-base-content opacity-70">Start Date:</span>
                <span className="ml-2">
                  {new Date(project.metrics.startDate).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="font-medium text-base-content opacity-70">Coordinates:</span>
                <span className="ml-2">
                  {project.coordinates.lat.toFixed(4)}, {project.coordinates.lng.toFixed(4)}
                </span>
              </div>
              <div>
                <span className="font-medium text-base-content opacity-70">Project ID:</span>
                <span className="ml-2 font-mono text-xs">{project.id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;