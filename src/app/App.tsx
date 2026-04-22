import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { DateList } from './components/DateList';
import { AddDateForm } from './components/AddDateForm';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';

export interface DateIdea {
  id: string;
  text: string;
  completed: boolean;
}

export default function App() {
  const [dateIdeas, setDateIdeas] = useState<DateIdea[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [ideaToDelete, setIdeaToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIdeas();

    const channel = supabase
      .channel('date_ideas')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'date_ideas' }, () => {
        fetchIdeas();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
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
      .insert({ text, completed: false })
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

  const filteredIdeas = dateIdeas.filter((idea) =>
    activeTab === 'active' ? !idea.completed : idea.completed
  );

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-[1.5rem] shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-8 pb-6">
          <h1 className="text-center text-foreground mb-2">Our Date Ideas</h1>
          <p className="text-center text-muted-foreground text-sm">
            健一とナミのやりたいことメモ
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pb-4">
          <div className="bg-secondary/50 rounded-xl p-1 flex gap-1">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex-1 py-2.5 rounded-lg transition-all ${
                activeTab === 'active'
                  ? 'bg-white shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              これから
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`flex-1 py-2.5 rounded-lg transition-all ${
                activeTab === 'completed'
                  ? 'bg-white shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              思い出
            </button>
          </div>
        </div>

        {/* Date List */}
        {loading ? (
          <div className="px-6 pb-6 h-[60vh] flex items-center justify-center">
            <p className="text-muted-foreground text-sm">読み込み中...</p>
          </div>
        ) : (
          <DateList
            ideas={filteredIdeas}
            activeTab={activeTab}
            onToggleComplete={toggleComplete}
            onDelete={requestDelete}
          />
        )}

        {/* Add Form */}
        {activeTab === 'active' && <AddDateForm onAdd={addIdea} />}
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
