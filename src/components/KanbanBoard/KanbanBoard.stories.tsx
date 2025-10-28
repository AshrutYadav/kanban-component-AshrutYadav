import type { Meta, StoryObj } from '@storybook/react';
import KanbanBoard from './KanbanBoard';
import type { KanbanColumn, KanbanTask } from './KanbanBoard.types';
import { useState } from 'react';

const meta: Meta<typeof KanbanBoard> = {
  title: 'Components/KanbanBoard',
  component: KanbanBoard,
};
export default meta;

const makeData = (count = 6, tasksCount = 12) => {
  const columns: KanbanColumn[] = Array.from({ length: count }).map((_, i) => ({
    id: `col-${i + 1}`,
    title: ['Backlog', 'Todo', 'In Progress', 'Review', 'Blocked', 'Done'][i] ?? `Column ${i + 1}`,
    color: '#e5e7eb',
    taskIds: [],
  }));
  const tasks: Record<string, KanbanTask> = {};
  const priorities: KanbanTask['priority'][] = ['low', 'medium', 'high', 'urgent'];
  for (let i = 0; i < tasksCount; i++) {
    const id = `t-${i + 1}`;
    const col = columns[i % columns.length];
    col.taskIds.push(id);
    tasks[id] = {
      id,
      title: `Task ${i + 1}`,
      description: i % 3 === 0 ? 'Example task description to show truncation and layout.' : undefined,
      status: col.id,
      createdAt: new Date(),
      priority: priorities[i % priorities.length],
      assignee: i % 2 === 0 ? 'Alex Johnson' : 'Priya Singh',
      tags: i % 4 === 0 ? ['frontend', 'bug', 'urgent'] : i % 3 === 0 ? ['backend'] : ['ui'],
      dueDate: i % 5 === 0 ? new Date(Date.now() - 86400000) : new Date(Date.now() + 86400000 * 3),
    };
  }
  return { columns, tasks };
};

type Story = StoryObj<typeof KanbanBoard>;

export const Default: Story = {
  render: () => {
    const { columns, tasks } = makeData(4, 12);
    return (
      <KanbanBoard
        columns={columns}
        tasks={tasks}
        onTaskMove={() => {}}
        onTaskCreate={() => {}}
        onTaskUpdate={() => {}}
        onTaskDelete={() => {}}
      />
    );
  },
};

export const EmptyState: Story = {
  render: () => {
    const { columns, tasks } = makeData(4, 0);
    return (
      <KanbanBoard
        columns={columns}
        tasks={tasks}
        onTaskMove={() => {}}
        onTaskCreate={() => {}}
        onTaskUpdate={() => {}}
        onTaskDelete={() => {}}
      />
    );
  },
};

export const ManyTasks: Story = {
  render: () => {
    const { columns, tasks } = makeData(4, 40);
    return (
      <KanbanBoard
        columns={columns}
        tasks={tasks}
        onTaskMove={() => {}}
        onTaskCreate={() => {}}
        onTaskUpdate={() => {}}
        onTaskDelete={() => {}}
      />
    );
  },
};

export const DifferentPriorities: Story = {
  render: () => {
    const { columns, tasks } = makeData(4, 12);
    Object.values(tasks).forEach((t, i) => {
      t.priority = (['low', 'medium', 'high', 'urgent'] as KanbanTask['priority'][])[i % 4];
    });
    return (
      <KanbanBoard
        columns={columns}
        tasks={tasks}
        onTaskMove={() => {}}
        onTaskCreate={() => {}}
        onTaskUpdate={() => {}}
        onTaskDelete={() => {}}
      />
    );
  },
};

export const InteractiveDemo: Story = {
  render: () => {
    const initial = makeData(4, 16);
    const [columns, setColumns] = useState<KanbanColumn[]>(initial.columns);
    const [tasks, setTasks] = useState<Record<string, KanbanTask>>(initial.tasks);

    const onTaskMove = (taskId: string, fromColumn: string, toColumn: string, newIndex: number) => {
      setColumns((cols) => {
        const next = cols.map((c) => ({ ...c }));
        const from = next.find((c) => c.id === fromColumn)!;
        const to = next.find((c) => c.id === toColumn)!;
        from.taskIds = from.taskIds.filter((id) => id !== taskId);
        const idx = Math.max(0, Math.min(newIndex, to.taskIds.length));
        to.taskIds = [...to.taskIds.slice(0, idx), taskId, ...to.taskIds.slice(idx)];
        return next;
      });
      setTasks((t) => ({ ...t, [taskId]: { ...t[taskId], status: toColumn } }));
    };

    const onTaskCreate = (columnId: string, task: KanbanTask) => {
      setTasks((t) => ({ ...t, [task.id]: task }));
      setColumns((cols) => cols.map((c) => (c.id === columnId ? { ...c, taskIds: [...c.taskIds, task.id] } : c)));
    };

    const onTaskUpdate = (taskId: string, updates: Partial<KanbanTask>) => {
      setTasks((t) => ({ ...t, [taskId]: { ...t[taskId], ...updates } }));
    };

    const onTaskDelete = (taskId: string) => {
      setTasks((t) => {
        const { [taskId]: _, ...rest } = t;
        return rest;
      });
      setColumns((cols) => cols.map((c) => ({ ...c, taskIds: c.taskIds.filter((id) => id !== taskId) })));
    };

    return (
      <KanbanBoard
        columns={columns}
        tasks={tasks}
        onTaskMove={onTaskMove}
        onTaskCreate={onTaskCreate}
        onTaskUpdate={onTaskUpdate}
        onTaskDelete={onTaskDelete}
      />
    );
  },
};

export const MobileView: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => {
    const { columns, tasks } = makeData(4, 8);
    return (
      <div className="max-w-sm">
        <KanbanBoard
          columns={columns}
          tasks={tasks}
          onTaskMove={() => {}}
          onTaskCreate={() => {}}
          onTaskUpdate={() => {}}
          onTaskDelete={() => {}}
        />
      </div>
    );
  },
};

export const Accessibility: Story = {
  name: 'Accessibility (Keyboard Demo)',
  render: () => {
    const { columns, tasks } = makeData(3, 9);
    return (
      <div>
        <p className="mb-2 text-sm text-neutral-700">
          Use Tab to focus a card, Space to pick up, arrow keys to move, Enter to drop.
        </p>
        <KanbanBoard
          columns={columns}
          tasks={tasks}
          onTaskMove={() => {}}
          onTaskCreate={() => {}}
          onTaskUpdate={() => {}}
          onTaskDelete={() => {}}
        />
      </div>
    );
  },
};
