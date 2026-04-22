import { Heart, Trash2 } from 'lucide-react';
import type { DateIdea } from '../App';

interface DateListProps {
  ideas: DateIdea[];
  activeTab: 'active' | 'completed';
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export function DateList({
  ideas,
  activeTab,
  onToggleComplete,
  onDelete,
}: DateListProps) {
  return (
    <div className="px-6 pb-6">
      <div
        className={`h-[100dvh] max-h-[60vh] overflow-y-auto space-y-2 pr-1 ${activeTab === 'completed' ? 'opacity-70' : ''}`}
      >
      {ideas.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/50 mb-4">
            <Heart className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            {activeTab === 'active'
              ? 'No ideas yet. Add your first date idea!'
              : 'No completed dates yet. Start checking them off!'}
          </p>
        </div>
      ) : ideas.map((idea) => (
        <div
          key={idea.id}
          className="group bg-background/50 hover:bg-background border border-border rounded-xl px-4 py-3.5 flex items-center gap-3 transition-all"
        >
          {/* Checkbox */}
          <button
            onClick={() => onToggleComplete(idea.id)}
            className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center transition-all hover:scale-110"
            style={{
              backgroundColor: idea.completed ? 'var(--primary)' : 'transparent',
            }}
          >
            {idea.completed && (
              <svg
                className="w-3.5 h-3.5 text-primary-foreground"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          {/* Text */}
          <span
            className={`flex-1 text-foreground ${
              idea.completed ? 'line-through opacity-60' : ''
            }`}
          >
            {idea.text}
          </span>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(idea.id)}
            className="flex-shrink-0 p-2 -m-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      </div>
    </div>
  );
}
