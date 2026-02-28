import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const [students, rooms, payments] = await Promise.all([
    prisma.student.count(),
    prisma.room.findMany(),
    prisma.payment.findMany(),
  ]);

  const totalBeds = rooms.reduce((sum, room) => sum + room.capacity, 0);
  const occupiedBeds = rooms.reduce((sum, room) => sum + room.occupied, 0);
  const paidRevenue = payments
    .filter((payment) => payment.status === "PAID")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const overdueCount = payments.filter(
    (payment) => payment.status === "OVERDUE"
  ).length;

  const cards = [
    { label: "Total Students", value: students },
    { label: "Total Rooms", value: rooms.length },
    { label: "Occupied Beds", value: `${occupiedBeds}/${totalBeds}` },
    { label: "Paid Revenue", value: `₹${paidRevenue.toFixed(2)}` },
    { label: "Overdue Payments", value: overdueCount },
  ];

  return (
    <section>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-600">
        Quick snapshot of current hostel operations.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border bg-white p-4">
            <p className="text-sm text-gray-600">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold">{card.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}