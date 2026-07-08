import { NextRequest, NextResponse } from 'next/server';

const HEX_RE = /^[0-9a-fA-F]{3,6}$/;

function xmlEscape(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function GET(
  request: NextRequest,
  { params }: { params: { size: string } }
) {
  const { size } = params;
  const searchParams = request.nextUrl.searchParams;
  const rawText = searchParams.get('text') || 'Image';
  const bg = searchParams.get('bg') || '2563eb';
  const fg = searchParams.get('fg') || 'ffffff';

  if (!HEX_RE.test(bg) || !HEX_RE.test(fg)) {
    return new NextResponse('Invalid color parameter', { status: 400 });
  }

  const [width, height] = size.split('x').map(Number);

  if (!width || !height || width < 1 || height < 1 || width > 2000 || height > 2000) {
    return new NextResponse('Invalid size', { status: 400 });
  }

  const text = xmlEscape(rawText);

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
