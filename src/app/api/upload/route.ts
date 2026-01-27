import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

export async function POST(req: Request) {
  try {
    const { fileName, fileType, fileSize } = await req.json();

    // Validation
    if (!fileName || !fileType || !fileSize) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(fileType)) {
      return NextResponse.json(
        { success: false, message: "Invalid file type" },
        { status: 400 }
      );
    }

    if (fileSize > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: "File too large" },
        { status: 400 }
      );
    }

    const filePath = `products/${crypto.randomUUID()}-${fileName}`;

    const { data, error } = await supabase.storage
      .from("uploads")
      .createSignedUploadUrl(filePath);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      uploadUrl: data.signedUrl,
      path: filePath,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
