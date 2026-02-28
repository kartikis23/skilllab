import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Params) {
  const { id } = await params;
  const room = await prisma.room.findUnique({
    where: { id: Number(id) },
    include: { students: true, payments: true },
  });

  if (!room) {
    return NextResponse.json({ error: "Room not found." }, { status: 404 });
  }

  return NextResponse.json(room);
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const roomId = Number(id);
    const body = await req.json();

    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) {
      return NextResponse.json({ error: "Room not found." }, { status: 404 });
    }

    const capacity =
      body.capacity === undefined ? room.capacity : Number(body.capacity);
    if (capacity < room.occupied) {
      return NextResponse.json(
        { error: "Capacity cannot be less than current occupied count." },
        { status: 400 }
      );
    }

    const updated = await prisma.room.update({
      where: { id: roomId },
      data: {
        roomNumber: body.roomNumber ?? room.roomNumber,
        capacity,
        rent: body.rent === undefined ? room.rent : Number(body.rent),
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Unable to update room." },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    const { id } = await params;
    const roomId = Number(id);

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { students: true },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found." }, { status: 404 });
    }

    if (room.students.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete room with assigned students." },
        { status: 400 }
      );
    }

    await prisma.room.delete({ where: { id: roomId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to delete room." },
      { status: 500 }
    );
  }
}