import type { Meta, StoryObj } from '@storybook/react';
import KanbanBoard from './KanbanBoard';
import type { KanbanColumn, KanbanTask } from './KanbanBoard.types';
import { useState } from 'react';

const meta: Meta = {
  title: 'Components/KanbanBoard',
  component: KanbanBoard,
  argTypes: {
    columnCount: { control: { type: 'range', min: 1, max: 6, step: 1 }, description: 'Number of columns' },
    tasksPerColumn: { control: { type: 'range', min: 0, max: 50, step: 5 }, description: 'Tasks per column' },
    priorityMode: { control: { type: 'select' }, options: ['random', 'none'], description: 'Apply priorities' },
    darkMode: { control: 'boolean', description: 'Enable dark mode (bonus)' },
  },
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

type Story = StoryObj;

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

export const Empty: Story = {
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

export const LargeDataset: Story = {
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

export const InteractivePlayground: Story = {
  args: { columnCount: 4, tasksPerColumn: 4, priorityMode: 'random', darkMode: false },
  render: (args: any) => {
    const initial = makeData(args.columnCount, args.columnCount * args.tasksPerColumn);
    const [columns, setColumns] = useState<KanbanColumn[]>(initial.columns);
    const [tasks, setTasks] = useState<Record<string, KanbanTask>>(initial.tasks);

    if (args.priorityMode === 'none') {
      Object.values(tasks).forEach((t) => {
        delete t.priority;
      });
    }

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

    const addRandomTask = () => {
      const cid = columns[Math.floor(Math.random() * columns.length)]?.id;
      if (!cid) return;
      const id = Math.random().toString(36).slice(2);
      const newTask: KanbanTask = {
        id,
        title: `New Task ${Object.keys(tasks).length + 1}`,
        status: cid,
        createdAt: new Date(),
        priority: args.priorityMode === 'random' ? (['low', 'medium', 'high', 'urgent'] as const)[Math.floor(Math.random() * 4)] : undefined,
      };
      onTaskCreate(cid, newTask);
    };
    const removeRandomTask = () => {
      const all = Object.keys(tasks);
      const pick = all[0];
      if (pick) onTaskDelete(pick);
    };

    return (
      <div className={args.darkMode ? 'dark bg-neutral-900 p-2' : ''}>
        <div className="mb-2 flex gap-2">
          <button className="rounded bg-primary-600 px-3 py-1 text-white" onClick={addRandomTask}>Add Task</button>
          <button className="rounded bg-neutral-200 px-3 py-1" onClick={removeRandomTask}>Remove Task</button>
        </div>
        <KanbanBoard
          columns={columns}
          tasks={tasks}
          onTaskMove={onTaskMove}
          onTaskCreate={onTaskCreate}
          onTaskUpdate={onTaskUpdate}
          onTaskDelete={onTaskDelete}
        />
      </div>
    );
  },
};

export const MobileResponsive: Story = {
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
