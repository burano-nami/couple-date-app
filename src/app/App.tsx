import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { DateList } from './components/DateList';
import { AddDateForm } from './components/AddDateForm';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';

export type Category = 'おでかけ' | 'やりたい' | '旅行';

export interface DateIdea {
  id: string;
  text: string;
  completed: boolean;
  category: Category;
}

const CATEGORIES: Category[] = ['おでかけ', 'やりたい', '旅行'];


export default function App() {
  const [dateIdeas, setDateIdeas] = useState<DateIdea[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category>('おでかけ');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [ideaToDelete, setIdeaToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIdeas();
    const interval = setInterval(fetchIdeas, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchIdeas = async () => {
    const { data } = await supabase
      .from('date_ideas')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setDateIdeas(data);
    setLoading(false);
  };

  const addIdea = async (text: string) => {
    const { data } = await supabase
      .from('date_ideas')
      .insert({ text, completed: false, category: activeCategory })
      .select()
      .single();
    if (data) setDateIdeas((prev) => [data, ...prev]);
  };

  const toggleComplete = async (id: string) => {
    const idea = dateIdeas.find((i) => i.id === id);
    if (!idea) return;
    setDateIdeas((prev) =>
      prev.map((i) => (i.id === id ? { ...i, completed: !i.completed } : i))
    );
    await supabase.from('date_ideas').update({ completed: !idea.completed }).eq('id', id);
  };

  const requestDelete = (id: string) => {
    setIdeaToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (ideaToDelete) {
      setDateIdeas((prev) => prev.filter((i) => i.id !== ideaToDelete));
      setDeleteModalOpen(false);
      setIdeaToDelete(null);
      await supabase.from('date_ideas').delete().eq('id', ideaToDelete);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setIdeaToDelete(null);
  };

  const filteredIdeas = dateIdeas.filter((idea) => idea.category === activeCategory);

  return (
    <div className="h-dvh bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md h-full max-h-[800px] bg-card rounded-[1.5rem] shadow-lg flex flex-col overflow-hidden" data-category={activeCategory}>
        {/* Header */}
        <div className="px-6 pt-8 pb-6">
          <h1 className="text-center text-foreground mb-2">DATE LIST</h1>
          <p className="text-center text-muted-foreground text-sm">
            健一とナミのやりたいことメモ
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pb-4">
          <div className="bg-secondary/50 rounded-xl p-1 flex gap-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                data-category={cat}
                className="flex-1 py-1.5 rounded-lg transition-all text-sm"
                style={
                  activeCategory === cat
                    ? { backgroundColor: 'var(--cat-main)', color: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }
                    : { color: 'var(--muted-foreground)' }
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Date List */}
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground text-sm">読み込み中...</p>
            </div>
          ) : (
            <DateList
              ideas={filteredIdeas}
              onToggleComplete={toggleComplete}
              onDelete={requestDelete}
            />
          )}
        </div>

        {/* Add Form */}
        <AddDateForm onAdd={addIdea} />
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
