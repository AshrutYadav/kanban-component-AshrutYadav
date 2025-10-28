import { useCallback, useMemo, useState } from 'react';
import type { KanbanColumn, KanbanTask } from '../components/KanbanBoard/KanbanBoard.types';

export const useKanbanBoard = (initialColumns: KanbanColumn[], initialTasks: Record<string, KanbanTask>) => {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns);
  const [tasks, setTasks] = useState<Record<string, KanbanTask>>(initialTasks);

  const mapTaskToColumn = useMemo(() => {
    const map = new Map<string, string>();
    columns.forEach((col) => col.taskIds.forEach((id) => map.set(id, col.id)));
    return map;
  }, [columns]);

  const onTaskCreate = useCallback((columnId: string, task: KanbanTask) => {
    setTasks((t) => ({ ...t, [task.id]: task }));
    setColumns((cols) => cols.map((c) => (c.id === columnId ? { ...c, taskIds: [...c.taskIds, task.id] } : c)));
  }, []);

  const onTaskUpdate = useCallback((taskId: string, updates: Partial<KanbanTask>) => {
    setTasks((t) => ({ ...t, [taskId]: { ...t[taskId], ...updates } }));
  }, []);

  const onTaskDelete = useCallback((taskId: string) => {
    setTasks((t) => {
      const { [taskId]: _, ...rest } = t;
      return rest;
    });
    setColumns((cols) => cols.map((c) => ({ ...c, taskIds: c.taskIds.filter((id) => id !== taskId) })));
  }, []);

  const onTaskMove = useCallback(
    (taskId: string, fromColumn: string, toColumn: string, newIndex: number) => {
      setColumns((cols) => {
        const next = cols.map((c) => ({ ...c }));
        const from = next.find((c) => c.id === fromColumn);
        const to = next.find((c) => c.id === toColumn);
        if (!from || !to) return cols;
        from.taskIds = from.taskIds.filter((id) => id !== taskId);
        const idx = Math.max(0, Math.min(newIndex, to.taskIds.length));
        to.taskIds = [...to.taskIds.slice(0, idx), taskId, ...to.taskIds.slice(idx)];
        return next;
      });
      setTasks((t) => ({ ...t, [taskId]: { ...t[taskId], status: toColumn } }));
    },
    []
  );

  return { columns, tasks, onTaskCreate, onTaskUpdate, onTaskDelete, onTaskMove, mapTaskToColumn };
};
