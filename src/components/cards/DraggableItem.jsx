import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import ApplicationCard from './ApplicationCard.jsx';

/**
 * DraggableItem wraps an ApplicationCard with dnd-kit sortable behavior
 * @param {{app: import('../../../types/Types.js').JobApplication, leftStatus?: string, rightStatus?: string, updateAppStatus: function, isFirst?: boolean, isLast?: boolean}} props
 */
export default function DraggableItem({ app, leftStatus, rightStatus, updateAppStatus, isFirst = false, isLast = false }) {
  const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({id: app.id});
  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition: isDragging ? undefined : transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 'auto',
    willChange: isDragging ? 'transform' : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ApplicationCard
        app={app}
        status={app.status}
        onMoveLeft={(id) => updateAppStatus(id, leftStatus)}
        onMoveRight={(id) => updateAppStatus(id, rightStatus)}
        isFirst={isFirst}
        isLast={isLast}
      />
    </div>
  );
}
