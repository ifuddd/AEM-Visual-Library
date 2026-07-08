import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const ALLOWED_EXTS: Record<string, string> = {
  jpeg: 'jpg',
  jpg: 'jpg',
  png: 'png',
  webp: 'webp',
  gif: 'gif',
};

// 5 MB → base64 inflates by ~37%
const MAX_BASE64_LEN = Math.ceil(5 * 1024 * 1024 * 1.37);

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image || !image.startsWith('data:image/')) {
      return NextResponse.json({ error: 'Invalid image data' }, { status: 400 });
    }

    if (image.length > MAX_BASE64_LEN) {
      return NextResponse.json({ error: 'File too large. Maximum 5 MB.' }, { status: 413 });
    }

    const mimeType = image.match(/data:image\/([a-z0-9+]+);/)?.[1] ?? '';
    const ext = ALLOWED_EXTS[mimeType];
    if (!ext) {
      return NextResponse.json(
        { error: 'Unsupported image type. Use JPG, PNG, WebP, or GIF.' },
        { status: 400 }
      );
    }

    const base64Data = image.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');

    const filename = `thumbnail-${Date.now()}.${ext}`;
    const uploadsDir = join(process.cwd(), 'public', 'uploads');

    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    await writeFile(join(uploadsDir, filename), buffer);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (error) {
    console.error('Thumbnail upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
