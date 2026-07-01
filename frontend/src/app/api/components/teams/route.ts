import { NextResponse } from 'next/server';
import { mockComponents } from '@/data/mockComponents';

export async function GET() {
  const teams = mockComponents.map((c) => c.ownerTeam);
  const uniqueTeams = Array.from(new Set(teams)).sort();

  return NextResponse.json({
    success: true,
    data: uniqueTeams,
  });
}
