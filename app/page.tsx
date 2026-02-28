import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto flex min-h-[80vh] max-w-5xl flex-col items-center justify-center px-6">
      <main className="w-full rounded-2xl border p-8">
        <h1 className="text-3xl font-semibold">Hostel Management System</h1>
        <p className="mt-3 text-sm text-gray-600">
          Manage rooms, student allocation, and monthly payments from one place.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            className="rounded-xl border p-4 text-center font-medium hover:bg-gray-50"
            href="/dashboard"
          >
            Dashboard
          </Link>
          <Link
            className="rounded-xl border p-4 text-center font-medium hover:bg-gray-50"
            href="/students"
          >
            Students
          </Link>
          <Link
            className="rounded-xl border p-4 text-center font-medium hover:bg-gray-50"
            href="/rooms"
          >
            Rooms
          </Link>
          <Link
            className="rounded-xl border p-4 text-center font-medium hover:bg-gray-50"
            href="/payments"
          >
            Payments
          </Link>
        </div>
      </main>
    </div>
  );
}
