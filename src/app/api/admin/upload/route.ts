import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('images') as File[];
    const singleFile = formData.get('image') as File | null;

    const toProcess = files.length > 0 ? files : singleFile ? [singleFile] : [];

    if (toProcess.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No files provided' },
        { status: 400 }
      );
    }

    const uploadedUrls: string[] = [];

    for (const file of toProcess) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const mimeType = file.type || 'image/jpeg';

      try {
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        await mkdir(uploadDir, { recursive: true });
        const ext = path.extname(file.name) || '.jpg';
        const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);
        uploadedUrls.push(`/uploads/${filename}`);
      } catch {
        // On serverless read-only filesystems (e.g. Vercel), return a Base64 data URL so the image works immediately
        const base64Data = `data:${mimeType};base64,${buffer.toString('base64')}`;
        uploadedUrls.push(base64Data);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Files uploaded successfully',
      data: {
        url: uploadedUrls[0],
        urls: uploadedUrls,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}
