import { useState } from 'react';
import Modal from '../primitives/Modal';
import type { KanbanTask } from './KanbanBoard.types';
import Button from '../primitives/Button';

interface Props {
  open: boolean;
  task: KanbanTask | null;
  onClose: () => void;
  onSave: (taskId: string, updates: Partial<KanbanTask>) => void;
  onDelete: (taskId: string) => void;
}

export default function TaskModal({ open, task, onClose, onSave, onDelete }: Props) {
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [priority, setPriority] = useState<KanbanTask['priority']>(task?.priority ?? 'medium');

  const onSubmit = () => {
    if (!task) return;
    onSave(task.id, { title, description, priority });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit Task">
      <div className="space-y-3">
        <input
          aria-label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border border-neutral-300 p-2 text-sm"
          placeholder="Title"
        />
        <textarea
          aria-label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md border border-neutral-300 p-2 text-sm"
          rows={4}
          placeholder="Description"
        />
        <select
          aria-label="Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as KanbanTask['priority'])}
          className="w-full rounded-md border border-neutral-300 p-2 text-sm"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
        <div className="flex justify-end gap-2">
          {task && (
            <Button variant="ghost" onClick={() => onDelete(task.id)}>
              Delete
            </Button>
          )}
          <Button onClick={onSubmit}>Save</Button>
        </div>
      </div>
    </Modal>
  );
}
