import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    // Validate base64 image
    if (!image || !image.startsWith('data:image/')) {
      return NextResponse.json(
        { error: 'Invalid image data' },
        { status: 400 }
      );
    }

    // Extract base64 data and convert to buffer
    const base64Data = image.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');

    // Get file extension from mime type
    const mimeMatch = image.match(/data:image\/(\w+);/);
    const ext = mimeMatch ? mimeMatch[1] : 'png';
    const filename = `thumbnail-${Date.now()}.${ext}`;

    // For now, return a mock URL (in production, this would call backend storage service)
    // TODO: Call backend storage service when Azure Blob Storage is fully configured
    const mockUrl = `https://placehold.co/400x300/${Math.random().toString(36).substring(7)}?text=Thumbnail`;

    // In production, uncomment this and configure backend URL:
    /*
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const uploadResponse = await fetch(`${backendUrl}/api/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        buffer: base64Data,
        filename,
        contentType: `image/${ext}`,
      }),
    });

    if (!uploadResponse.ok) {
      throw new Error('Backend upload failed');
    }

    const { url } = await uploadResponse.json();
    return NextResponse.json({ url });
    */

    // For now, return mock URL
    return NextResponse.json({ url: mockUrl });
  } catch (error) {
    console.error('Thumbnail upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
