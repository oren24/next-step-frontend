import { useCallback, useState } from 'react';
import { PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { getCurrentTimestamp } from '../utils/statusHistoryUtils.js';

export const useDragAndDropSensors = () => {
  return useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 5 } })
  );
};

export const useDragState = () => {
  const [activeId, setActiveId] = useState(null);

  const handleDragStart = useCallback((event) => {
    setActiveId(event.active?.id ?? null);
  }, []);

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  return {
    activeId,
    setActiveId,
    handleDragStart,
    handleDragCancel,
  };
};

export const useDragEndHandler = (setApps, statusOrder) => {
  const handleDragEnd = useCallback(
    (event) => {
      const activeIdLocal = event.active?.id;
      const overId = event.over?.id;

      if (!activeIdLocal || !overId || activeIdLocal === overId) return;

      setApps((prev) => {
        // O(1) lookup: build Map instead of multiple findIndex calls
        const itemById = new Map(prev.map((item) => [item.id, item]));
        const activeItem = itemById.get(activeIdLocal);
        const overItem = itemById.get(overId);

        if (!activeItem) return prev;

        const now = getCurrentTimestamp();
        const oldStatus = activeItem.status;
        const nextStatus = statusOrder.includes(overId) ? overId : overItem?.status;

        // No change needed
        if (!nextStatus || oldStatus === nextStatus) return prev;

        // Create updated item with minimal operations
        const updatedItem = {
          ...activeItem,
          status: nextStatus,
          updatedAt: now,
          statusHistory: [
            ...(activeItem.statusHistory || []),
            { status: nextStatus, timestamp: now },
          ],
        };

        // Rebuild array with updated item: filter out old, insert in correct position
        const result = prev.filter((item) => item.id !== activeIdLocal);

        // Find insertion point: after last item with same status
        const lastSameStatusIdx = result.findLastIndex((item) => item.status === nextStatus);
        if (lastSameStatusIdx === -1) {
          result.push(updatedItem);
        } else {
          result.splice(lastSameStatusIdx + 1, 0, updatedItem);
        }

        return result;
      });
    },
    [setApps, statusOrder]
  );

  return { handleDragEnd };
};
