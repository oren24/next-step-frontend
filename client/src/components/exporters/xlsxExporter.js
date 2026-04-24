import ExcelJS from 'exceljs';
import { buildExportRows, EXPORT_COLUMNS } from './exportData.js';

const downloadBufferAsFile = (buffer, filename) => {
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportApplicationsToXLSX = async (applications, filename) => {
  const rows = buildExportRows(applications);

  if (!rows.length) {
    console.warn('No applications to export');
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Applications');

  const columns = Object.entries(EXPORT_COLUMNS).map(([key, header]) => ({ key, header }));
  worksheet.columns = columns;
  rows.forEach((row) => {
    worksheet.addRow(row);
  });

  worksheet.getRow(1).font = { bold: true };
  worksheet.columns.forEach((column) => {
    column.width = 18;
  });

  const timestamp = new Date().toISOString().slice(0, 10);
  const downloadFilename = filename || `job-applications-${timestamp}.xlsx`;

  const buffer = await workbook.xlsx.writeBuffer();
  downloadBufferAsFile(buffer, downloadFilename);
};

