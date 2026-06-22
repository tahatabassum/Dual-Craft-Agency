import type { TeamMember } from '../types';

interface TeamCardProps {
  member: TeamMember;
}

// Map initials to unique background combos
const initialsColors: Record<string, { bg: string; text: string; ring: string }> = {
  TT: { bg: 'bg-navy', text: 'text-white', ring: 'ring-navy/20' },
  MS: { bg: 'bg-teal', text: 'text-white', ring: 'ring-teal/20' },
};

export default function TeamCard({ member }: TeamCardProps) {
  const colors = initialsColors[member.initials] || {
    bg: 'bg-navy',
    text: 'text-white',
    ring: 'ring-navy/20',
  };

  return (
    <div
      className="card-offwhite border border-navy/10 p-8 flex flex-col items-center text-center 
        group cursor-default"
    >
      {/* Avatar */}
      <div className="relative mb-5">
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            className={`w-24 h-24 rounded-full object-cover ring-4 ${colors.ring} 
              group-hover:ring-teal/40 transition-all duration-300`}
          />
        ) : (
          <div
            className={`w-24 h-24 rounded-full ${colors.bg} ${colors.text} 
              flex items-center justify-center text-2xl font-heading font-bold 
              ring-4 ${colors.ring} group-hover:ring-teal/40 
              transition-all duration-300 select-none`}
          >
            {member.initials}
          </div>
        )}
        {/* Status dot */}
        <span
          className="absolute bottom-1 right-1 w-4 h-4 bg-teal rounded-full 
            border-2 border-offwhite"
          title="Available for projects"
        />
      </div>

      {/* Info */}
      <h3 className="text-xl font-heading font-bold text-navy mb-1.5">
        {member.name}
      </h3>
      <p className="text-teal font-medium text-sm">{member.role}</p>
    </div>
  );
}
