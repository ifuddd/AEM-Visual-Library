import { NextRequest, NextResponse } from 'next/server';
import { mockComponents } from '@/data/mockComponents';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get('search');
  const tags = searchParams.get('tags');
  const status = searchParams.get('status');
  const ownerTeam = searchParams.get('ownerTeam');
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '20');

  let filtered = [...mockComponents];

  // Apply search filter
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.title.toLowerCase().includes(searchLower) ||
        c.description.toLowerCase().includes(searchLower) ||
        c.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  }

  // Apply tags filter
  if (tags) {
    const tagArray = tags.split(',').map((t) => t.trim().toLowerCase());
    filtered = filtered.filter((c) =>
      c.tags.some((tag) => tagArray.includes(tag.toLowerCase()))
    );
  }

  // Apply status filter
  if (status) {
    filtered = filtered.filter((c) => c.status === status);
  }

  // Apply ownerTeam filter
  if (ownerTeam) {
    filtered = filtered.filter(
      (c) => c.ownerTeam.toLowerCase() === ownerTeam.toLowerCase()
    );
  }

  // Calculate pagination
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const paginatedData = filtered.slice(start, start + pageSize);

  return NextResponse.json({
    success: true,
    data: {
      data: paginatedData,
      total,
      page,
      pageSize,
      totalPages,
    },
  });
}
