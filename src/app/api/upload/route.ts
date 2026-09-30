import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { requireAdminSession } from "@/lib/auth";
import { isCloudinaryConfigured, getCloudinaryClient } from "@/lib/cloudinary";
import type { UploadApiResponse } from "cloudinary";

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8 MB

const ALLOWED_SIGNATURES: {
  mime: string;
  declaredMimes: string[];
  extension: string;
  detect: (bytes: Uint8Array) => boolean;
}[] = [
  {
    mime: "image/jpeg",
    declaredMimes: ["image/jpeg", "image/jpg", "image/pjpeg"],
    extension: ".jpg",
    detect: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  },
  {
    mime: "image/png",
    declaredMimes: ["image/png"],
    extension: ".png",
    detect: (b) =>
      b[0] === 0x89 &&
      b[1] === 0x50 &&
      b[2] === 0x4e &&
      b[3] === 0x47 &&
      b[4] === 0x0d &&
      b[5] === 0x0a &&
      b[6] === 0x1a &&
      b[7] === 0x0a,
  },
  {
    mime: "image/gif",
    declaredMimes: ["image/gif"],
    extension: ".gif",
    detect: (b) =>
      b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38,
  },
  {
    mime: "image/webp",
    declaredMimes: ["image/webp"],
    extension: ".webp",
    detect: (b) =>
      b[0] === 0x52 &&
      b[1] === 0x49 &&
      b[2] === 0x46 &&
      b[3] === 0x46 &&
      b[8] === 0x57 &&
      b[9] === 0x45 &&
      b[10] === 0x42 &&
      b[11] === 0x50,
  },
  {
    mime: "image/avif",
    declaredMimes: ["image/avif"],
    extension: ".avif",
    detect: (b) =>
      b[4] === 0x66 &&
      b[5] === 0x74 &&
      b[6] === 0x79 &&
      b[7] === 0x70,
  },
];

function detectType(bytes: Uint8Array) {
  return ALLOWED_SIGNATURES.find((t) => t.detect(bytes)) ?? null;
}

async function uploadToCloudinary(
  buffer: Buffer,
  folder: string
): Promise<UploadApiResponse> {
  const cloudinary = getCloudinaryClient();
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Cloudinary upload failed"));
        } else {
          resolve(result);
        }
      }
    );
    stream.end(buffer);
  });
}

async function processUploadFile(file: File): Promise<string> {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(`File "${file.name}" is too large. Maximum 8 MB.`);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const bytes = new Uint8Array(buffer);
  const detected = detectType(bytes);

  if (!detected) {
    throw new Error(
      `Unsupported file type for "${file.name}". Upload JPG, PNG, GIF, WebP, or AVIF.`
    );
  }

  if (isCloudinaryConfigured()) {
    const result = await uploadToCloudinary(buffer, "hujurat-solar");
    return result.secure_url;
  } else {
    const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
    await mkdir(UPLOAD_DIR, { recursive: true });
    const filename = `${Date.now()}-${crypto.randomUUID()}${detected.extension}`;
    await writeFile(path.join(UPLOAD_DIR, filename), bytes);
    return `/uploads/${filename}`;
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    
    // Collect all files from "files" or "file" form keys
    const rawFiles: unknown[] = [
      ...formData.getAll("files"),
      ...formData.getAll("file"),
    ];

    const files = rawFiles.filter(
      (f): f is File => f instanceof File && f.size > 0
    );

    if (files.length === 0) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const urls: string[] = [];
    for (const file of files) {
      const url = await processUploadFile(file);
      urls.push(url);
    }

    return NextResponse.json({
      url: urls[0],
      urls,
    });
  } catch (err) {
    console.error("Upload API error:", err);
    const message = err instanceof Error ? err.message : "Upload failed. Please try again.";
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}

