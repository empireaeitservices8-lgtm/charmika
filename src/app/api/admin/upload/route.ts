import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const files: File[] = [];
    const imageField = formData.get("image");
    const fileField = formData.get("file");
    const imagesField = formData.getAll("images");

    if (imageField && imageField instanceof File) {
      files.push(imageField);
    }
    if (fileField && fileField instanceof File) {
      files.push(fileField);
    }
    if (imagesField && imagesField.length > 0) {
      imagesField.forEach((f) => {
        if (f instanceof File) files.push(f);
      });
    }

    if (files.length === 0) {
      return NextResponse.json(
        { success: false, message: "No image file provided for upload." },
        { status: 400 }
      );
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadsDir)) {
      await fs.mkdir(uploadsDir, { recursive: true });
    }

    const uploadedResults = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = path.extname(file.name).toLowerCase() || ".jpg";
      const cleanBase = path.basename(file.name, ext).replace(/[^a-zA-Z0-9]/g, "-");
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `${cleanBase}-${uniqueSuffix}${ext}`;
      const filePath = path.join(uploadsDir, filename);

      await fs.writeFile(filePath, buffer);

      uploadedResults.push({
        url: `/uploads/${filename}`,
        filename,
        originalName: file.name,
        size: file.size,
      });
    }

    if (uploadedResults.length === 1 && !formData.has("images")) {
      return NextResponse.json({
        success: true,
        message: "Image uploaded successfully.",
        data: uploadedResults[0],
      });
    }

    return NextResponse.json({
      success: true,
      message: `${uploadedResults.length} image(s) uploaded successfully.`,
      data: uploadedResults,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to upload file." },
      { status: 500 }
    );
  }
}
