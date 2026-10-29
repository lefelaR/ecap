import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { uploadsDir } from '@/services/store';

const CONTENT_TYPE_BY_EXTENSION: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
};

export async function GET(
  _request: Request,
  { params }: { params: { filename: string } },
) {
  const filename = path.basename(params.filename);
  if (filename !== params.filename) {
    return NextResponse.json({ error: 'Invalid filename.' }, { status: 400 });
  }

  const filePath = path.join(uploadsDir(), 'profiles', filename);

  try {
    const file = await fs.readFile(filePath);
    const extension = filename.split('.').pop()?.toLowerCase() ?? '';
    const contentType = CONTENT_TYPE_BY_EXTENSION[extension] ?? 'application/octet-stream';

    return new NextResponse(file, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Image not found.' }, { status: 404 });
  }
}
