import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado" },
        { status: 400 },
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Arquivo deve ser uma imagem" },
        { status: 400 },
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Imagem muito grande (máx. 5MB)" },
        { status: 413 },
      );
    }

    const token = (await cookies()).get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = join(process.cwd(), "public/uploads");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const timestamp = Date.now();
    const extension = file.name.split(".").pop() || "jpg";
    const filename = `product-${timestamp}.${extension}`;
    const filepath = join(uploadsDir, filename);

    await writeFile(filepath, buffer);

    const imageUrl = `/uploads/${filename}`;

    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
