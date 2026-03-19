/**
 * CSV Exporter for Job Applications
 * Converts job application data to CSV format and downloads it
 */

/**
 * Define the columns that will be exported to CSV
 * The key is used as the object property, the value is the CSV header
 */
const CSV_COLUMNS = {
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

/**
 * Escape CSV field values to handle commas, quotes, and newlines
 * @param {string | number | null | undefined} value - The value to escape
 * @returns {string} The escaped value
 */
const escapeCSVValue = (value) => {
  if (value === null || value === undefined) {
    return '';
  }

  let stringValue = String(value);

  // If the value contains comma, quote, or newline, wrap it in quotes and escape internal quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    stringValue = `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
};

/**
 * Format a date string to a readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

/**
 * Convert job applications array to CSV string
 * @param {Array} applications - Array of job application objects
 * @returns {string} CSV formatted string
 */
export const applicationsToCSV = (applications) => {
  if (!applications || applications.length === 0) {
    return '';
  }

  // Create header row
  const headers = Object.values(CSV_COLUMNS);
  const headerRow = headers.map(escapeCSVValue).join(',');

  // Create data rows
  const dataRows = applications.map((app) => {
    const values = Object.keys(CSV_COLUMNS).map((key) => {
      let value = app[key];

      // Handle special cases for formatting
      if (key === 'tags' && Array.isArray(value)) {
        value = value.join('; ');
      } else if (key === 'createdAt' || key === 'nextInterviewDate' || key === 'answerDeadline') {
        value = formatDate(value);
      } else if (key === 'offerAmount' && value) {
        value = `${value} ${app.offerCurrency || 'USD'}`;
      }

      return escapeCSVValue(value);
    });

    return values.join(',');
  });

  // Combine header and data rows
  return [headerRow, ...dataRows].join('\n');
};

/**
 * Download CSV file
 * @param {string} csvContent - CSV formatted string
 * @param {string} filename - Name for the downloaded file
 */
export const downloadCSV = (csvContent, filename = 'job-applications.csv') => {
  // Create a Blob from the CSV content
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  // Create a temporary URL for the blob
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  // Set the download attributes
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  // Append to DOM, click, and clean up
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the URL object
  URL.revokeObjectURL(url);
};

/**
 * Main export function - converts applications to CSV and downloads the file
 * @param {Array} applications - Array of job application objects
 * @param {string} filename - Optional filename for the download
 */
export const exportApplicationsToCSV = (applications, filename) => {
  const csvContent = applicationsToCSV(applications);

  if (!csvContent) {
    console.warn('No applications to export');
    return;
  }

  const timestamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format
  const downloadFilename = filename || `job-applications-${timestamp}.csv`;

  downloadCSV(csvContent, downloadFilename);
};
