import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const rooms = await prisma.room.findMany({
    include: { students: true },
    orderBy: { roomNumber: "asc" },
  });
  return NextResponse.json(rooms);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const roomNumber = String(body.roomNumber ?? "").trim();
    const capacity = Number(body.capacity ?? 0);
    const rent = Number(body.rent ?? 0);

    if (!roomNumber || capacity < 1 || rent <= 0) {
      return NextResponse.json(
        { error: "roomNumber, capacity and rent are required." },
        { status: 400 }
      );
    }

    const room = await prisma.room.create({
      data: { roomNumber, capacity, rent },
    });

    return NextResponse.json(room, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Unable to create room." },
      { status: 500 }
    );
  }
}