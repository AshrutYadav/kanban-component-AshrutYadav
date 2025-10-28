import { memo, useCallback, useMemo, useState } from 'react';
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
      <KanbanCard task={task} onOpen={onOpen} />
      {isDragging && <div className="mt-[-100%] h-0" aria-hidden />}
    </div>
  );
}

function KanbanColumnBase({ column, tasks, onAdd, onOpen }: Props) {
  // Virtualization state
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });
  const itemHeight = 120; // avg card height with margins
  const onScroll: React.UIEventHandler<HTMLDivElement> = useCallback((e) => {
    const scrollTop = (e.currentTarget as HTMLDivElement).scrollTop;
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - 5);
    const end = start + 25; // viewport + buffer
    setVisibleRange({ start, end });
  }, []);
  const sliced = useMemo(() => tasks.slice(visibleRange.start, visibleRange.end), [tasks, visibleRange]);
  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    const target = e.target as HTMLElement;
    if (target.getAttribute('role') !== 'option') return;
    const items = Array.from(
      (e.currentTarget.querySelectorAll('[role="option"]') as NodeListOf<HTMLElement>) || []
    );
    const idx = items.indexOf(target);
    if (idx === -1) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = items[Math.min(idx + 1, items.length - 1)];
      next?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = items[Math.max(idx - 1, 0)];
      prev?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      items[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      items[items.length - 1]?.focus();
    }
  };
  return (
    <section
      role="listbox"
      aria-label={column.title}
      className="flex h-full w-[260px] shrink-0 snap-start flex-col rounded-xl bg-neutral-50 ring-1 ring-neutral-200 sm:w-[300px] md:w-[320px]"
    >
      <header className="sticky top-0 z-10 flex items-center justify-between gap-2 bg-neutral-50 p-3">
        <h3 className="font-semibold text-neutral-900">{column.title}</h3>
        <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700">{tasks.length}</span>
      </header>
      <div className="flex-1 space-y-3 overflow-y-auto p-3" role="list" onKeyDown={onKeyDown} onScroll={onScroll}>
        {tasks.length === 0 && (
          <div className="rounded-md border border-dashed border-neutral-300 p-4 text-center text-sm text-neutral-600">
            No tasks
          </div>
        )}
        {sliced.map((t, idx) => {
          const absoluteIndex = idx + visibleRange.start;
          return (
          <div key={t.id} role="listitem" className="space-y-2">
            <DroppableSlot columnId={column.id} index={absoluteIndex} />
            <DraggableCard task={t} onOpen={onOpen} />
          </div>
          );
        })}
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
