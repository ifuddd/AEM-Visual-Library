import { NextResponse } from 'next/server';
import { mockComponents } from '@/data/mockComponents';

export async function GET() {
  const allTags = mockComponents.flatMap((c) => c.tags);
  const uniqueTags = Array.from(new Set(allTags)).sort();

  return NextResponse.json({
    success: true,
    data: uniqueTags,
  });
}
