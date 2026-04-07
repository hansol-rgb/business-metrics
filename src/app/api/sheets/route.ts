import { NextResponse } from 'next/server';
import { getPNLData } from '@/lib/data';

export async function GET() {
  try {
    const data = await getPNLData();
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to fetch PNL data:', message);
    return NextResponse.json(
      { error: 'Failed to fetch data', ...(process.env.NODE_ENV === 'development' ? { details: message } : {}) },
      { status: 500 }
    );
  }
}
