import { useState } from 'react';
import { Plus } from 'lucide-react';

interface AddDateFormProps {
  onAdd: (text: string) => void;
}

export function AddDateForm({ onAdd }: AddDateFormProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed) {
      onAdd(trimmed);
      setInputValue('');
    }
  };

  return (
    <div className="sticky bottom-0 pt-8 pb-6 px-6" style={{ background: 'linear-gradient(to top, var(--cat-bg) 60%, transparent)' }}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new date idea..."
          className="w-full px-4 py-3.5 pr-12 bg-input-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className={`absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
            inputValue.trim()
              ? 'bg-primary text-primary-foreground hover:scale-105 shadow-sm'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          <Plus className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
