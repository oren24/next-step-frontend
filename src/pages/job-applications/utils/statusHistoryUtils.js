export const getCurrentTimestamp = () => new Date().toISOString();

export const withStatusHistoryEntry = (app, status, timestamp = getCurrentTimestamp()) => ({
  ...app,
  statusHistory: [...(app.statusHistory || []), { status, timestamp }],
});

export const updateAppStatus = (app, nextStatus) => {
  const now = getCurrentTimestamp();
  const oldStatus = app.status;
  const updated = {
    ...app,
    status: nextStatus,
    updatedAt: now,
  };

  if (oldStatus === nextStatus) {
    return updated;
  }

  return withStatusHistoryEntry(updated, nextStatus, now);
};
