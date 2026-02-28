import { PaymentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Params) {
  const { id } = await params;
  const payment = await prisma.payment.findUnique({
    where: { id: Number(id) },
    include: { student: true, room: true },
  });

  if (!payment) {
    return NextResponse.json({ error: "Payment not found." }, { status: 404 });
  }

  return NextResponse.json(payment);
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const paymentId = Number(id);
    const body = await req.json();

    const existing = await prisma.payment.findUnique({ where: { id: paymentId } });
    if (!existing) {
      return NextResponse.json({ error: "Payment not found." }, { status: 404 });
    }

    const nextStatus = Object.values(PaymentStatus).includes(body.status)
      ? body.status
      : existing.status;

    const updated = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        amount: body.amount === undefined ? existing.amount : Number(body.amount),
        dueDate:
          body.dueDate === undefined ? existing.dueDate : new Date(body.dueDate),
        status: nextStatus,
        paidAt:
          nextStatus === PaymentStatus.PAID
            ? existing.paidAt ?? new Date()
            : null,
      },
      include: { student: true, room: true },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Unable to update payment." },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    const { id } = await params;
    await prisma.payment.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to delete payment." },
      { status: 500 }
    );
  }
}