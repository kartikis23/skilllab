import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Params) {
  const { id } = await params;
  const student = await prisma.student.findUnique({
    where: { id: Number(id) },
    include: { room: true, payments: true },
  });

  if (!student) {
    return NextResponse.json({ error: "Student not found." }, { status: 404 });
  }

  return NextResponse.json(student);
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const studentId = Number(id);
    const body = await req.json();
    const nextRoomId = body.roomId ? Number(body.roomId) : null;

    const existing = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Student not found." }, { status: 404 });
    }

    if (nextRoomId && nextRoomId !== existing.roomId) {
      const newRoom = await prisma.room.findUnique({ where: { id: nextRoomId } });
      if (!newRoom) {
        return NextResponse.json({ error: "Room not found." }, { status: 404 });
      }
      if (newRoom.occupied >= newRoom.capacity) {
        return NextResponse.json(
          { error: "Target room is full." },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.$transaction(async (transaction) => {
      if (existing.roomId && existing.roomId !== nextRoomId) {
        await transaction.room.update({
          where: { id: existing.roomId },
          data: { occupied: { decrement: 1 } },
        });
      }

      if (nextRoomId && existing.roomId !== nextRoomId) {
        await transaction.room.update({
          where: { id: nextRoomId },
          data: { occupied: { increment: 1 } },
        });
      }

      return transaction.student.update({
        where: { id: studentId },
        data: {
          name: body.name ?? existing.name,
          email: body.email ?? existing.email,
          phone: body.phone ?? existing.phone,
          roomId: nextRoomId,
        },
        include: { room: true },
      });
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Unable to update student." },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    const { id } = await params;
    const studentId = Number(id);

    const existing = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Student not found." }, { status: 404 });
    }

    await prisma.$transaction(async (transaction) => {
      await transaction.student.delete({ where: { id: studentId } });
      if (existing.roomId) {
        await transaction.room.update({
          where: { id: existing.roomId },
          data: { occupied: { decrement: 1 } },
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to delete student." },
      { status: 500 }
    );
  }
}