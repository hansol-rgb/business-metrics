import { NextResponse } from 'next/server';
import { getPNLData } from '@/lib/data';

export async function GET() {
  try {
    const data = await getPNLData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch PNL data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
