export const getAppTags = (app) => {
  if (!app) return [];
  if (Array.isArray(app.tags)) return app.tags;
  if (Array.isArray(app.skills)) return app.skills;
  if (typeof app.tags === 'string') {
    return app.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  return [];
};

export const getCompanyLink = (app) => {
  if (!app) return '';
  return app.url || app.jobUrl || app.link || '';
};

const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const getAppliedDate = (app) => {
  if (!app) return '-';
  return formatDate(app.appliedAt || app.createdAt || app.updatedAt);
};

export const getCreatedDate = (app) => {
  if (!app) return '-';
  return formatDate(app.createdAt);
};

export const buildEditFormData = (app) => ({
  position: app?.position || app?.jobTitle || '',
  company: app?.company || app?.companyName || '',
  location: app?.location || '',
  workType: app?.workType || '',
  jobUrl: app?.jobUrl || app?.url || '',
  platform: app?.platform || '',
  tags: Array.isArray(app?.tags) ? app.tags.join(', ') : app?.tags || '',
});

