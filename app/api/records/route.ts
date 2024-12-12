// app/api/records/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { r2 } from "@/lib/r2";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

type RecordType = Awaited<ReturnType<typeof prisma.record.findMany>>[number];

export async function GET() {
  try {
    const records = await prisma.record.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    const recordsWithSignedUrls = await Promise.all(
      records.map(async (record: RecordType) => {
        const filename = record.fileUrl.split('/').pop()!;
        const command = new GetObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: filename,
        });
        const signedUrl = await getSignedUrl(r2, command, { expiresIn: 3600 }); // URL platná 1 hodinu

        return {
          ...record,
          fileUrl: signedUrl,
        };
      })
    );
    
    return NextResponse.json(recordsWithSignedUrls);
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
    
    // Konvertovanie File na Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload do R2
    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: filename,
        Body: buffer,
        ContentType: file.type,
      })
    );

    // Vytvorenie verejnej URL
    const fileUrl = `https://${process.env.R2_BUCKET_NAME}.${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${filename}`;

    // Vytvorenie záznamu v databáze
    const record = await prisma.record.create({
      data: {
        name,
        age,
        fileUrl,
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