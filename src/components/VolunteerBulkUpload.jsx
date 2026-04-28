import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import {
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
  Loader2,
  UploadCloud,
  Users,
} from 'lucide-react';
import GlassPanel from './GlassPanel';

const API_BASE_URL = 'http://localhost:5000/api';

function normalizeRows(rows) {
  return rows
    .map((row) => ({
      Name: row.Name || row.name || '',
      Phone: row.Phone || row.phone || row.phoneNumber || '',
      Skills: row.Skills || row.skills || '',
      Location: row.Location || row.location || row.Address || row.address || '',
      raw: row,
    }))
    .filter((row) => Object.values(row).some((value) => value !== '' && value !== row.raw));
}

export default function VolunteerBulkUpload({ onUploadComplete }) {
  const [fileName, setFileName] = useState('');
  const [parsedRows, setParsedRows] = useState([]);
  const [previewRows, setPreviewRows] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState(null);

  function handleParsedData(rows, acceptedFileName) {
    const normalizedRows = normalizeRows(rows);

    setFileName(acceptedFileName);
    setParsedRows(rows);
    setPreviewRows(normalizedRows.slice(0, 5));
    setUploadResult(null);
    setErrorMessage(
      normalizedRows.length > 0 ? '' : 'No volunteer rows were detected. Check your headers and file content.'
    );
  }

  function parseCsv(file) {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: ({ data, errors }) => {
        if (errors.length > 0) {
          setErrorMessage(errors[0].message || 'Unable to parse CSV file');
          return;
        }

        handleParsedData(data, file.name);
      },
      error: (error) => {
        setErrorMessage(error.message || 'Unable to parse CSV file');
      },
    });
  }

  function parseSpreadsheet(file) {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const workbook = XLSX.read(event.target.result, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(firstSheet, { defval: '' });
        handleParsedData(rows, file.name);
      } catch (error) {
        setErrorMessage(error.message || 'Unable to parse spreadsheet');
      }
    };

    reader.onerror = () => {
      setErrorMessage('Unable to read spreadsheet file');
    };

    reader.readAsArrayBuffer(file);
  }

  function onDrop(acceptedFiles) {
    const [file] = acceptedFiles;

    if (!file) {
      return;
    }

    setErrorMessage('');

    if (file.name.toLowerCase().endsWith('.csv')) {
      parseCsv(file);
      return;
    }

    parseSpreadsheet(file);
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
  });

  async function handleUpload() {
    if (parsedRows.length === 0) {
      setErrorMessage('Upload a CSV or Excel file before sending volunteers to the database.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(8);
    setUploadResult(null);
    setErrorMessage('');

    const interval = window.setInterval(() => {
      setUploadProgress((current) => (current >= 90 ? current : current + 9));
    }, 180);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/ngo/bulk-upload-volunteers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(parsedRows),
      });

      const result = await response.json();

      if (!response.ok && response.status !== 207) {
        throw new Error(result.message || 'Bulk upload failed');
      }

      setUploadProgress(100);
      setUploadResult(result);

      if (typeof onUploadComplete === 'function') {
        await onUploadComplete();
      }
    } catch (error) {
      setErrorMessage(error.message || 'Bulk upload failed');
    } finally {
      window.clearInterval(interval);
      setIsUploading(false);
      window.setTimeout(() => setUploadProgress(0), 900);
    }
  }

  return (
    <GlassPanel className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-emerald-400/10 p-3 text-emerald-200">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Volunteer Bulk Upload</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Ingest CSV or Excel rosters and validate the first rows before sync.
            </p>
          </div>
        </div>
        <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-emerald-100">
          NGO Admin
        </div>
      </div>

      <div
        {...getRootProps()}
        className={`mt-6 cursor-pointer rounded-[28px] border border-dashed p-8 transition ${
          isDragActive
            ? 'border-emerald-300/60 bg-emerald-400/10'
            : 'border-black/10 bg-white/[0.03] hover:border-emerald-300/30 hover:bg-emerald-400/[0.06] dark:border-white/10'
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="mx-auto h-10 w-10 text-emerald-200" />
        <p className="mt-4 text-center text-lg text-slate-900 dark:text-white">
          {isDragActive ? 'Drop the file to prepare a volunteer preview' : 'Drag and drop CSV or Excel volunteer rosters'}
        </p>
        <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
          Supported headers: Name, Phone, Skills, Location or Address.
        </p>
        {fileName ? (
          <div className="mt-5 flex items-center justify-center gap-2 text-sm text-emerald-100">
            <FileSpreadsheet className="h-4 w-4" />
            {fileName}
          </div>
        ) : null}
      </div>

      {errorMessage ? (
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-300/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      ) : null}

      <div className="mt-6 rounded-3xl border border-black/10 bg-white/[0.03] p-5 dark:border-white/10">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Preview
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              First 5 volunteers for a quick header and field sanity check.
            </p>
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            {previewRows.length > 0 ? `${previewRows.length} / ${parsedRows.length}` : 'No data yet'}
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-black/10 text-left text-sm dark:divide-white/10">
            <thead>
              <tr className="text-slate-500 dark:text-slate-400">
                <th className="pb-3 pr-4 font-medium">Name</th>
                <th className="pb-3 pr-4 font-medium">Phone</th>
                <th className="pb-3 pr-4 font-medium">Skills</th>
                <th className="pb-3 font-medium">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {previewRows.length > 0 ? (
                previewRows.map((row, index) => (
                  <tr key={`${row.Phone}-${index}`} className="align-top text-slate-700 dark:text-slate-200">
                    <td className="py-3 pr-4">{row.Name || 'Missing name'}</td>
                    <td className="py-3 pr-4">{row.Phone || 'Missing phone'}</td>
                    <td className="py-3 pr-4">{row.Skills || 'Missing skills'}</td>
                    <td className="py-3">{row.Location || 'Missing location'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-slate-500 dark:text-slate-400">
                    Upload a roster to populate the preview table.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <span>Upload Progress</span>
          <span>{uploadProgress}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="text-sm text-slate-500 dark:text-slate-400">
          {parsedRows.length > 0
            ? `${parsedRows.length} volunteers ready for upload`
            : 'Waiting for a file to prepare the bulk upload payload'}
        </div>
        <button
          type="button"
          onClick={handleUpload}
          disabled={parsedRows.length === 0 || isUploading}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-300/20 bg-emerald-400/15 px-5 py-3 text-sm font-semibold text-emerald-50 transition hover:bg-emerald-400/25 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
          Upload to Database
        </button>
      </div>

      {uploadResult ? (
        <div className="mt-6 space-y-4 rounded-3xl border border-cyan-300/20 bg-cyan-400/10 p-5">
          <div className="flex items-start gap-3 text-cyan-50">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">{uploadResult.message}</p>
              <p className="mt-1 text-sm text-cyan-100/80">
                {uploadResult.successfulRows} processed, {uploadResult.createdCount} created, {uploadResult.updatedCount} updated.
              </p>
            </div>
          </div>

          {uploadResult.failedRows?.length > 0 ? (
            <div className="rounded-2xl border border-yellow-300/20 bg-yellow-300/10 p-4 text-sm text-yellow-50">
              <p className="font-semibold">Failed Rows</p>
              <div className="mt-2 space-y-2">
                {uploadResult.failedRows.slice(0, 5).map((failedRow) => (
                  <div key={`${failedRow.row}-${failedRow.reason}`}>
                    Row {failedRow.row}: {failedRow.reason}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </GlassPanel>
  );
}
