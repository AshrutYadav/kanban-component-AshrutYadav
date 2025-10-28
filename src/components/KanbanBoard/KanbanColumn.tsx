import { memo } from 'react';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import type { KanbanTask, KanbanColumn as Column } from './KanbanBoard.types';
import KanbanCard from './KanbanCard';
import Button from '../primitives/Button';

interface Props {
  column: Column;
  tasks: KanbanTask[];
  onAdd: (columnId: string) => void;
  onOpen: (task: KanbanTask) => void;
}

function DroppableSlot({ columnId, index }: { columnId: string; index: number }) {
  const id = `${columnId}::${index}`;
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      data-drop-index={index}
      aria-hidden
      className={`h-2 rounded bg-transparent transition ${isOver ? 'bg-primary-100' : ''}`}
    />
  );
}

function DraggableCard({ task, onOpen }: { task: KanbanTask; onOpen: (t: KanbanTask) => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id });
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, opacity: 0.9, zIndex: 10, position: 'relative' as const }
    : undefined;
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <KanbanCard task={task} onClick={onOpen} />
      {isDragging && <div className="mt-[-100%] h-0" aria-hidden />}
    </div>
  );
}

function KanbanColumnBase({ column, tasks, onAdd, onOpen }: Props) {
  return (
    <section
      role="region"
      aria-label={column.title}
      className="flex h-full w-[300px] shrink-0 flex-col rounded-xl bg-neutral-50 ring-1 ring-neutral-200"
    >
      <header className="sticky top-0 z-10 flex items-center justify-between gap-2 bg-neutral-50 p-3">
        <h3 className="font-semibold text-neutral-900">{column.title}</h3>
        <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700">{tasks.length}</span>
      </header>
      <div className="flex-1 space-y-3 overflow-y-auto p-3" role="list">
        {tasks.length === 0 && (
          <div className="rounded-md border border-dashed border-neutral-300 p-4 text-center text-sm text-neutral-600">
            No tasks
          </div>
        )}
        {tasks.map((t, idx) => (
          <div key={t.id} role="listitem" className="space-y-2">
            <DroppableSlot columnId={column.id} index={idx} />
            <DraggableCard task={t} onOpen={onOpen} />
          </div>
        ))}
        <DroppableSlot columnId={column.id} index={tasks.length} />
      </div>
      <footer className="p-3">
        <Button variant="ghost" className="w-full" onClick={() => onAdd(column.id)}>
          Add Task
        </Button>
      </footer>
    </section>
  );
}

export default memo(KanbanColumnBase);
