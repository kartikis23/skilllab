export const dynamic = "force-dynamic";
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
      <h1 className="text-3xl font-black tracking-tight">Dashboard</h1>
      <p className="soft-text mt-1 text-sm">
        Quick snapshot of current hostel operations.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => (
          <div key={card.label} className="panel p-5">
            <p className="soft-text text-xs uppercase tracking-wide">{card.label}</p>
            <p className="mt-2 text-3xl font-black tracking-tight">{card.value}</p>
            <div
              className={`mt-4 h-1.5 rounded-full ${
                index % 3 === 0
                  ? "bg-gradient-to-r from-orange-500 to-rose-400"
                  : index % 3 === 1
                    ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                    : "bg-gradient-to-r from-cyan-500 to-blue-400"
              }`}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
