import { google } from 'googleapis';
import { promises as fs } from 'fs';
import path from 'path';
import { parseCSV } from '@/lib/csv';

async function fetchFromCSV(): Promise<string[][]> {
  const csvPath = path.join(process.cwd(), 'src', 'data', 'pnl.csv');
  const content = await fs.readFile(csvPath, 'utf-8');
  return parseCSV(content);
}

export async function fetchPNLRawData(): Promise<string[][]> {
  const sheetId = process.env.GOOGLE_SHEETS_ID;
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (sheetId && email && privateKey) {
    try {
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
    } catch (sheetsError) {
      console.error('Google Sheets API failed, falling back to CSV:', sheetsError instanceof Error ? sheetsError.message : sheetsError);
      try {
        return await fetchFromCSV();
      } catch (csvError) {
        throw new Error(
          `Both Google Sheets and CSV fallback failed. Sheets: ${sheetsError instanceof Error ? sheetsError.message : 'Unknown error'}. CSV: ${csvError instanceof Error ? csvError.message : 'Unknown error'}`
        );
      }
    }
  }

  return fetchFromCSV();
}
