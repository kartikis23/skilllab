import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const students = await prisma.student.findMany({
    include: { room: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(students);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const phone = body.phone ? String(body.phone).trim() : null;
    const roomId = body.roomId ? Number(body.roomId) : null;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 }
      );
    }

    if (roomId) {
      const room = await prisma.room.findUnique({ where: { id: roomId } });
      if (!room) {
        return NextResponse.json({ error: "Room not found." }, { status: 404 });
      }
      if (room.occupied >= room.capacity) {
        return NextResponse.json(
          { error: "Room is already full." },
          { status: 400 }
        );
      }
    }

    const student = await prisma.$transaction(async (transaction) => {
      const created = await transaction.student.create({
        data: { name, email, phone, roomId },
        include: { room: true },
      });

      if (roomId) {
        await transaction.room.update({
          where: { id: roomId },
          data: { occupied: { increment: 1 } },
        });
      }

      return created;
    });

    return NextResponse.json(student, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Unable to create student." },
      { status: 500 }
    );
  }
}