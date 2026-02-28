import { PaymentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const payments = await prisma.payment.findMany({
    include: { student: true, room: true },
    orderBy: { dueDate: "desc" },
  });
  return NextResponse.json(payments);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const studentId = Number(body.studentId);
    const amount = Number(body.amount);
    const dueDate = new Date(body.dueDate);

    if (!studentId || !amount || Number.isNaN(dueDate.getTime())) {
      return NextResponse.json(
        { error: "studentId, amount and valid dueDate are required." },
        { status: 400 }
      );
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });
    if (!student) {
      return NextResponse.json({ error: "Student not found." }, { status: 404 });
    }

    const status = Object.values(PaymentStatus).includes(body.status)
      ? body.status
      : PaymentStatus.PENDING;

    const payment = await prisma.payment.create({
      data: {
        studentId,
        roomId: student.roomId,
        amount,
        dueDate,
        status,
        paidAt: status === PaymentStatus.PAID ? new Date() : null,
      },
      include: { student: true, room: true },
    });

    return NextResponse.json(payment, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Unable to create payment." },
      { status: 500 }
    );
  }
}