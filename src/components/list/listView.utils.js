import { JOB_STATUSES } from '../../constants/jobStatuses.js';

export const formatDate = (isoDate) => {
  if (!isoDate) return '--';
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '--';
  return date.toLocaleDateString();
};

export const buildRows = ({ apps, searchQuery, sortBy, sortDirection, statusFilter }) => {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filtered = apps.filter((app) => {
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    if (!normalizedQuery) return matchesStatus;

    const text = [app.companyName, app.jobTitle, app.platform, app.location, ...(app.tags || [])]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return matchesStatus && text.includes(normalizedQuery);
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'updatedAt' || sortBy === 'appliedDate') {
      const aTime = a[sortBy] ? new Date(a[sortBy]).getTime() : 0;
      const bTime = b[sortBy] ? new Date(b[sortBy]).getTime() : 0;
      return aTime - bTime;
    }

    return (a[sortBy] || '').localeCompare(b[sortBy] || '');
  });

  return sortDirection === 'asc' ? sorted : sorted.reverse();
};

export const buildGroupedRows = ({ rows, statusFilter }) => {
  const sections = statusFilter === 'All' ? JOB_STATUSES : [statusFilter];
  return sections.map((status) => ({
    status,
    items: rows.filter((app) => app.status === status),
  }));
};

