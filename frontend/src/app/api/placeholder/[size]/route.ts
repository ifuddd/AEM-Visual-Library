import { NextRequest, NextResponse } from 'next/server';

// Simple SVG placeholder generator
export async function GET(
  request: NextRequest,
  { params }: { params: { size: string } }
) {
  const { size } = params;
  const searchParams = request.nextUrl.searchParams;
  const text = searchParams.get('text') || 'Image';
  const bg = searchParams.get('bg') || '2563eb';
  const fg = searchParams.get('fg') || 'ffffff';

  // Parse size (e.g., "400x300")
  const [width, height] = size.split('x').map(Number);

  if (!width || !height || width > 2000 || height > 2000) {
    return new NextResponse('Invalid size', { status: 400 });
  }

  // Generate SVG
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#${bg}"/>
  <text
    x="50%"
    y="50%"
    dominant-baseline="middle"
    text-anchor="middle"
    font-family="Arial, sans-serif"
    font-size="${Math.min(width, height) / 10}"
    fill="#${fg}"
  >${text}</text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
