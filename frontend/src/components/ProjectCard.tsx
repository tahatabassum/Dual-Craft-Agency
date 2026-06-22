import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import type { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

const categoryColors: Record<string, string> = {
  'Web Development': 'bg-navy/10 text-navy',
  'Digital Marketing': 'bg-teal/10 text-teal-700',
  'SaaS': 'bg-purple-100 text-purple-700',
};

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="card group overflow-hidden flex flex-col">
      {/* Thumbnail */}
      <div className="relative overflow-hidden bg-navy/5 aspect-[16/9]">
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy/10 to-teal/10">
            <div className="text-center">
              <div className="w-12 h-12 rounded-lg bg-navy/20 flex items-center justify-center mx-auto mb-2">
                <span className="text-navy font-bold text-lg">
                  {project.title.charAt(0)}
                </span>
              </div>
              <p className="text-navy/40 text-xs">Preview coming soon</p>
            </div>
          </div>
        )}
        {/* Category badge */}
        <span
          className={`absolute top-3 left-3 badge ${
            categoryColors[project.category] || 'bg-navy/10 text-navy'
          }`}
        >
          {project.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-heading font-bold text-navy mb-2 group-hover:text-teal transition-colors duration-200">
          {project.title}
        </h3>
        <p className="text-charcoal/70 text-sm leading-relaxed mb-4 flex-1">
          {project.description}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-2 mb-5">
          {project.techStack.slice(0, 4).map((tech) => (
            <span key={tech} className="badge-navy text-xs">
              {tech}
            </span>
          ))}
          {project.techStack.length > 4 && (
            <span className="badge bg-navy/5 text-navy/50 text-xs">
              +{project.techStack.length - 4}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-navy/10">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-sm py-2 px-4 flex-1 justify-center"
          >
            <ExternalLink size={14} />
            View Live
          </a>
          <Link
            to={`/projects/${project.slug}`}
            className="btn-secondary text-sm py-2 px-4"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}
