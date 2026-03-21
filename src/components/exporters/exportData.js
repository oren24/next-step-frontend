export const EXPORT_COLUMNS = {
  id: 'ID',
  companyName: 'Company Name',
  jobTitle: 'Job Title',
  location: 'Location',
  workType: 'Work Type',
  status: 'Status',
  tags: 'Tags',
  createdAt: 'Applied Date',
  platform: 'Platform',
  notes: 'Notes',
  nextInterviewDate: 'Next Interview',
  round: 'Interview Round',
  answerDeadline: 'Offer Deadline',
  offerAmount: 'Offer Amount',
};

export const formatExportDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const mapApplicationToExportRow = (app) => {
  const row = {};

  Object.keys(EXPORT_COLUMNS).forEach((key) => {
    let value = app[key];

    if (key === 'tags' && Array.isArray(value)) {
      value = value.join('; ');
    } else if (key === 'createdAt' || key === 'nextInterviewDate' || key === 'answerDeadline') {
      value = formatExportDate(value);
    } else if (key === 'offerAmount' && value) {
      value = `${value} ${app.offerCurrency || 'USD'}`;
    }

    row[key] = value ?? '';
  });

  return row;
};

export const buildExportRows = (applications) => {
  if (!applications || applications.length === 0) return [];
  return applications.map(mapApplicationToExportRow);
};

