import { useState } from 'react';
import { DateList } from './components/DateList';
import { AddDateForm } from './components/AddDateForm';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';

export interface DateIdea {
  id: string;
  text: string;
  completed: boolean;
}

export default function App() {
  const [dateIdeas, setDateIdeas] = useState<DateIdea[]>([
    { id: '1', text: 'Visit the botanical garden at sunset', completed: false },
    { id: '2', text: 'Try that new Italian restaurant downtown', completed: false },
    { id: '3', text: 'Go stargazing at the observatory', completed: false },
    { id: '4', text: 'Take a pottery class together', completed: true },
    { id: '5', text: 'Weekend getaway to the coast', completed: true },
  ]);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [ideaToDelete, setIdeaToDelete] = useState<string | null>(null);

  const addIdea = (text: string) => {
    const newIdea: DateIdea = {
      id: Date.now().toString(),
      text,
      completed: false,
    };
    setDateIdeas([newIdea, ...dateIdeas]);
  };

  const toggleComplete = (id: string) => {
    setDateIdeas(
      dateIdeas.map((idea) =>
        idea.id === id ? { ...idea, completed: !idea.completed } : idea
      )
    );
  };

  const requestDelete = (id: string) => {
    setIdeaToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (ideaToDelete) {
      setDateIdeas(dateIdeas.filter((idea) => idea.id !== ideaToDelete));
      setDeleteModalOpen(false);
      setIdeaToDelete(null);
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
        <DateList
          ideas={filteredIdeas}
          activeTab={activeTab}
          onToggleComplete={toggleComplete}
          onDelete={requestDelete}
        />

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