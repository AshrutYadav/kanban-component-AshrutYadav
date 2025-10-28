import { useMemo, useState } from 'react';
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  type DragEndEvent,
} from '@dnd-kit/core';
import type { KanbanViewProps, KanbanTask } from './KanbanBoard.types';
import KanbanColumn from './KanbanColumn';
import TaskModal from './TaskModal';

export default function KanbanBoard({ columns, tasks, onTaskCreate, onTaskDelete, onTaskMove, onTaskUpdate }: KanbanViewProps) {
  const [openTask, setOpenTask] = useState<KanbanTask | null>(null);

  const columnsWithTasks = useMemo(
    () => columns.map((c) => ({ column: c, tasks: c.taskIds.map((id) => tasks[id]).filter(Boolean) })),
    [columns, tasks]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor)
  );

  const findTaskColumn = (taskId: string) => columns.find((c) => c.taskIds.includes(taskId))?.id ?? null;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);
    const fromColumn = findTaskColumn(activeId);
    if (!fromColumn) return;
    if (overId.includes('::')) {
      const [toColumn, indexStr] = overId.split('::');
      const newIndex = Number(indexStr);
      onTaskMove(activeId, fromColumn, toColumn, newIndex);
      return;
    }
    // Fallback: dropped over a card (taskId). Insert before that card in its column.
    const toColumn = findTaskColumn(overId);
    if (!toColumn) return;
    const toColumnObj = columns.find((c) => c.id === toColumn);
    if (!toColumnObj) return;
    const newIndex = toColumnObj.taskIds.indexOf(overId);
    if (newIndex < 0) return;
    onTaskMove(activeId, fromColumn, toColumn, newIndex);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div
        role="application"
        aria-roledescription="kanban board"
        className="flex h-[80vh] gap-3 overflow-x-auto px-3 py-2"
      >
        {columnsWithTasks.map(({ column, tasks: colTasks }) => (
          <KanbanColumn
            key={column.id}
            column={column}
            tasks={colTasks}
            onAdd={(cid) =>
              onTaskCreate(cid, {
                id: Math.random().toString(36).slice(2),
                title: 'New Task',
                status: cid,
                createdAt: new Date(),
              })
            }
            onOpen={setOpenTask}
          />
        ))}
        <TaskModal
          open={!!openTask}
          task={openTask}
          onClose={() => setOpenTask(null)}
          onSave={onTaskUpdate}
          onDelete={(id) => {
            onTaskDelete(id);
            setOpenTask(null);
          }}
        />
      </div>
    </DndContext>
  );
}
