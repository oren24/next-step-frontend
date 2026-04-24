const buildShareText = (app, jobUrl) => {
  const company = app?.companyName || app?.company || 'Unknown company';
  const role = app?.jobTitle || app?.position || 'Job opening';
  return jobUrl ? `${company} - ${role}\n${jobUrl}` : `${company} - ${role}`;
};

const getJobUrl = (app) => app?.jobUrl || app?.url || app?.link || '';

export const shareJobApplication = async (app) => {
  const jobUrl = getJobUrl(app);
  const title = `${app?.companyName || app?.company || 'Company'} - ${app?.jobTitle || app?.position || 'Role'}`;
  const text = buildShareText(app, jobUrl);

  if (navigator.share) {
    try {
      await navigator.share({ title, text, url: jobUrl || undefined });
      return true;
    } catch {
      // Fall back to clipboard when native share is cancelled or unavailable.
    }
  }

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  return false;
};

