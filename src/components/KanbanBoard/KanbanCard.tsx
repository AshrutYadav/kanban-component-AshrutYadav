import { memo, type ButtonHTMLAttributes } from 'react';
import type { KanbanTask } from './KanbanBoard.types';
import { getPriorityColor, isOverdue } from '../../utils/task.utils';
import Avatar from '../primitives/Avatar';

type Props = {
  task: KanbanTask;
  onClick: (task: KanbanTask) => void;
  isDragging?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

function KanbanCardBase({ task, onClick, isDragging, ...rest }: Props) {
  return (
    <button
      role="option"
      aria-label={task.title}
      aria-grabbed={!!isDragging}
      tabIndex={0}
      onClick={() => onClick(task)}
      {...rest}
      className={`w-full rounded-lg border border-neutral-200 bg-white p-3 text-left shadow-sm transition hover:shadow ${getPriorityColor(
        task.priority ?? 'medium'
      )}`}
    >
      <div className="mb-2 line-clamp-2 font-semibold text-neutral-900">{task.title}</div>
      {task.description && <div className="mb-2 line-clamp-2 text-sm text-neutral-700">{task.description}</div>}
      {task.tags && task.tags.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {task.tags.slice(0, 3).map((t) => (
            <span key={t} className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700">
              {t}
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between">
        {task.assignee && <Avatar name={task.assignee} />}
        {task.dueDate && (
          <span className={`text-xs ${isOverdue(task.dueDate) ? 'text-red-600' : 'text-neutral-600'}`}>
            Due: {task.dueDate.toLocaleDateString()}
          </span>
        )}
      </div>
    </button>
  );
}

export default memo(KanbanCardBase);
