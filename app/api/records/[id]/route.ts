import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = parseInt(params.id);
    const record = await prisma.record.findUnique({
      where: { id },
    });

    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    return NextResponse.json(record);
  } catch (err) {
    console.error('Error fetching record:', err);
    return NextResponse.json({ error: "Error fetching record" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = parseInt(params.id);
    const body = await request.json();
    const record = await prisma.record.update({
      where: { id },
      data: {
        name: body.name,
        age: body.age,
      },
    });

    return NextResponse.json(record);
  } catch (err) {
    console.error('Error updating record:', err);
    return NextResponse.json({ error: "Error updating record" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = parseInt(params.id);
    await prisma.record.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error('Error deleting record:', err);
    return NextResponse.json({ error: "Error deleting record" }, { status: 500 });
  }
} 