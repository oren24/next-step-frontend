/**
 * CSV Exporter for Job Applications
 * Converts job application data to CSV format and downloads it
 */

import { buildExportRows, EXPORT_COLUMNS } from './exportData.js';

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
 * Convert job applications array to CSV string
 * @param {Array} applications - Array of job application objects
 * @returns {string} CSV formatted string
 */
export const applicationsToCSV = (applications) => {
  const rows = buildExportRows(applications);
  if (!rows.length) {
    return '';
  }

  // Create header row
  const headers = Object.values(EXPORT_COLUMNS);
  const headerRow = headers.map(escapeCSVValue).join(',');

  // Create data rows
  const dataRows = rows.map((row) => {
    const values = Object.keys(EXPORT_COLUMNS).map((key) => escapeCSVValue(row[key]));

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
