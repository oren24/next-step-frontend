import { useMemo } from 'react';
import { buildColumns, queryMatchesApp } from '../utils/applicationHelpers.js';

export const useFilteredApplications = (apps, searchQuery = '') => {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return useMemo(
    () => apps.filter((app) => queryMatchesApp(app, normalizedQuery)),
    [apps, normalizedQuery]
  );
};

export const useApplicationColumns = (filteredApps, statusOrder) => {
  return useMemo(
    () => buildColumns(filteredApps, statusOrder),
    [filteredApps, statusOrder]
  );
};

export const useJobApplicationFilters = (apps, searchQuery = '', statusOrder) => {
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredApps = useFilteredApplications(apps, normalizedQuery);
  const columns = useApplicationColumns(filteredApps, statusOrder);

  return {
    filteredApps,
    columns,
    normalizedQuery,
  };
};

export const useApplicationFilters = useJobApplicationFilters;
