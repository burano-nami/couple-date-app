import { Heart, Trash2 } from 'lucide-react';
import type { DateIdea } from '../App';

interface DateListProps {
  ideas: DateIdea[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export function DateList({ ideas, onToggleComplete, onDelete }: DateListProps) {
  const active = ideas.filter((i) => !i.completed);
  const completed = ideas.filter((i) => i.completed);
  const sorted = [...active, ...completed];

  return (
    <div className="h-full px-6 pb-6">
      <div className="h-full overflow-y-auto space-y-2 pr-1">
        {sorted.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/50 mb-4">
              <Heart className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              まだ何もありません。追加してみよう！
            </p>
          </div>
        ) : (
          sorted.map((idea) => (
            <div
              key={idea.id}
              className={`group border border-border rounded-xl px-4 py-2 flex items-center gap-3 transition-all ${
                idea.completed ? 'opacity-40' : ''
              }`}
              style={{ backgroundColor: '#FAF9F7' }}
            >
              {/* Checkbox */}
              <button
                onClick={() => onToggleComplete(idea.id)}
                className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center transition-all hover:scale-110"
                style={{
                  backgroundColor: idea.completed ? 'var(--cat-main)' : 'transparent',
                  borderColor: 'var(--cat-main)',
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
                className="flex-1 text-foreground"
              >
                {idea.text}
              </span>

              {/* Delete Button */}
              <button
                onClick={() => onDelete(idea.id)}
                className="flex-shrink-0 p-2 -m-2 text-muted-foreground/20 hover:text-destructive transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
