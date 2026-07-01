import { NextRequest, NextResponse } from 'next/server';
import { mockComponents } from '@/data/mockComponents';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const component = mockComponents.find((c) => c.slug === params.slug);

  if (!component) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Component not found',
          code: 'NOT_FOUND',
        },
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: component,
  });
}
