import * as XLSX from 'xlsx';
import { buildExportRows, EXPORT_COLUMNS } from './exportData.js';

export const exportApplicationsToXLSX = (applications, filename) => {
  const rows = buildExportRows(applications);

  if (!rows.length) {
    console.warn('No applications to export');
    return;
  }

  const worksheetRows = rows.map((row) => {
    const output = {};
    Object.entries(EXPORT_COLUMNS).forEach(([key, header]) => {
      output[header] = row[key];
    });
    return output;
  });

  const worksheet = XLSX.utils.json_to_sheet(worksheetRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Applications');

  const timestamp = new Date().toISOString().slice(0, 10);
  const downloadFilename = filename || `job-applications-${timestamp}.xlsx`;
  XLSX.writeFile(workbook, downloadFilename);
};

