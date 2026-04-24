import { EMPTY_STATE_MESSAGES } from '../constants/boardConstants.js';

export const buildColumns = (apps, statusOrder) => {
  const columns = {};
  statusOrder.forEach((status) => {
    columns[status] = [];
  });

  apps.forEach((app) => {
    if (!columns[app.status]) {
      columns[app.status] = [];
    }
    columns[app.status].push(app);
  });

  return columns;
};

export const queryMatchesApp = (app, query) => {
  if (!query) return true;

  const searchableFields = [
    app.companyName,
    app.company,
    app.jobTitle,
    app.position,
    app.platform,
    app.location,
    app.notes,
    ...(app.tags || []),
  ].filter(Boolean);

  return searchableFields.join(' ').toLowerCase().includes(query);
};

export const getAdjacentStatuses = (currentStatus, statusOrder) => {
  const currentIndex = statusOrder.indexOf(currentStatus);

  return {
    leftStatus: statusOrder[Math.max(0, currentIndex - 1)],
    rightStatus: statusOrder[Math.min(statusOrder.length - 1, currentIndex + 1)],
    isFirst: currentIndex === 0,
    isLast: currentIndex === statusOrder.length - 1,
  };
};

export const getEmptyStateText = (status) => `Drag Your First ${EMPTY_STATE_MESSAGES[status] || status} Here!`;
