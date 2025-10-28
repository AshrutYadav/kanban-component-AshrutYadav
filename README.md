# Kanban Board Component

## Live Storybook
https://69010c047b006bc5652a8c1a-jdykjkobre.chromatic.com/

## Installation
```bash
npm install
npm run storybook
```

## Architecture
- React + TypeScript with Vite.
- Tailwind CSS with extended design tokens and class-based dark mode.
- Low-level drag-and-drop via @dnd-kit/core (Pointer + Keyboard sensors) with custom droppable slots for precise insertion.
- Components: KanbanBoard, KanbanColumn, KanbanCard, TaskModal, primitives (Button, Modal, Avatar).
- Hooks: useKanbanBoard (example state), useDragAndDrop (internal state utility).
- Accessibility-first: roles/labels, focus-visible styles, Escape to close modal, keyboard support (more below).
- Performance: memoization; plan includes virtualization for large columns, debounced filters, lazy-loaded modal.

## Features
- [x] Drag-and-drop tasks
- [x] Task creation/editing
- [x] Responsive design
- [x] Keyboard accessibility (Tab/Shift+Tab, Escape; Arrow/Home/End in progress)

## Storybook Stories
- Default board
- Empty state
- Large dataset
- Mobile view
- Interactive playground

## Technologies
- React + TypeScript
- Tailwind CSS
- Storybook (+ Chromatic)
- @dnd-kit/core, clsx, date-fns, zustand (optional)

## Contact
ashrutyadav7@gmail.com
