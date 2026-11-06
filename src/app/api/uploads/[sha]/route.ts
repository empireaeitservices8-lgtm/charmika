import { NextRequest, NextResponse } from 'next/server';
import { getImageBlobFromCloud } from '@/lib/cloud-store';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sha: string }> }
) {
  const { sha } = await params;
  const cleanSha = (sha || '').replace(/[^a-f0-9]/gi, '');
  if (!cleanSha) {
    return new NextResponse('Invalid image SHA', { status: 400 });
  }

  const buffer = await getImageBlobFromCloud(cleanSha);
  if (!buffer) {
    return new NextResponse('Image not found', { status: 404 });
  }

  const ext = req.nextUrl.searchParams.get('ext') || 'jpg';
  const contentType =
    ext === 'png'
      ? 'image/png'
      : ext === 'webp'
      ? 'image/webp'
      : 'image/jpeg';

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
