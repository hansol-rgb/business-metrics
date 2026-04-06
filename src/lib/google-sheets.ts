import { google } from 'googleapis';
import { promises as fs } from 'fs';
import path from 'path';
import { parseCSV } from '@/lib/csv';

export async function fetchPNLRawData(): Promise<string[][]> {
  const sheetId = process.env.GOOGLE_SHEETS_ID;
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (sheetId && email && privateKey) {
    const auth = new google.auth.JWT({
      email,
      key: privateKey.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Sheet1',
    });

    return (response.data.values ?? []) as string[][];
  }

  const csvPath = path.join(process.cwd(), 'src', 'data', 'pnl.csv');
  const content = await fs.readFile(csvPath, 'utf-8');
  return parseCSV(content);
}
