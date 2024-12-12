// app/api/records/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const records = await prisma.record.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    if (!records) {
      return NextResponse.json({ records: [] });
    }
    
    return NextResponse.json(records);
  } catch (err) {
    console.error('Database error:', err);
    return NextResponse.json(
      { error: "Error fetching records" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const age = parseInt(formData.get("age") as string);
    const file = formData.get("file") as File;

    // Vytvorenie unikátneho názvu súboru
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const filename = `${uniqueSuffix}-${file.name}`;
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    
    // Získanie a uloženie súboru
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    // Vytvorenie záznamu v databáze
    const record = await prisma.record.create({
      data: {
        name,
        age,
        fileUrl: `/uploads/${filename}`,
      },
    });

    return NextResponse.json(record);
  } catch (err) {
    console.error('Error creating record:', err);
    return NextResponse.json(
      { error: "Error creating record" },
      { status: 500 }
    );
  }
}