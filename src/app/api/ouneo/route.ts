// DEPRECATED: Use Genkit Server Actions instead.
import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ error: 'Endpoint deprecated. Use ouneoFlow.' }, { status: 410 });
}
