import { PrismaClient, PaymentStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.payment.deleteMany();
  await prisma.student.deleteMany();
  await prisma.room.deleteMany();

  const roomA = await prisma.room.create({
    data: { roomNumber: "A-101", capacity: 3, occupied: 0, rent: 6500 },
  });
  const roomB = await prisma.room.create({
    data: { roomNumber: "B-204", capacity: 2, occupied: 0, rent: 7200 },
  });
  await prisma.room.create({
    data: { roomNumber: "C-008", capacity: 4, occupied: 0, rent: 5800 },
  });

  const student1 = await prisma.student.create({
    data: {
      name: "Rahul Sharma",
      email: "rahul@example.com",
      phone: "+91-9876543210",
      roomId: roomA.id,
    },
  });

  const student2 = await prisma.student.create({
    data: {
      name: "Priya Patel",
      email: "priya@example.com",
      phone: "+91-9876500001",
      roomId: roomB.id,
    },
  });

  const student3 = await prisma.student.create({
    data: {
      name: "Amit Verma",
      email: "amit@example.com",
      phone: "+91-9876500002",
      roomId: roomA.id,
    },
  });

  await prisma.room.update({
    where: { id: roomA.id },
    data: { occupied: 2 },
  });
  await prisma.room.update({
    where: { id: roomB.id },
    data: { occupied: 1 },
  });

  await prisma.payment.createMany({
    data: [
      {
        studentId: student1.id,
        roomId: roomA.id,
        amount: 6500,
        dueDate: new Date("2026-03-05"),
        status: PaymentStatus.PENDING,
      },
      {
        studentId: student2.id,
        roomId: roomB.id,
        amount: 7200,
        dueDate: new Date("2026-02-05"),
        paidAt: new Date("2026-02-03"),
        status: PaymentStatus.PAID,
      },
      {
        studentId: student3.id,
        roomId: roomA.id,
        amount: 6500,
        dueDate: new Date("2026-01-05"),
        status: PaymentStatus.OVERDUE,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });