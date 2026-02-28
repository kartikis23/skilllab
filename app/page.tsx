import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto flex min-h-[80vh] max-w-6xl flex-col items-center justify-center">
      <main className="panel w-full p-8 sm:p-10">
        <p className="inline-flex rounded-full border border-orange-400/40 bg-orange-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-orange-200">
          SPORT MODE UI
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
          Hostel Management System
        </h1>
        <p className="soft-text mt-3 text-sm sm:text-base">
          Manage rooms, student allocation, and monthly payments from one place.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            className="group rounded-xl border border-white/15 bg-white/5 p-4 text-center font-semibold hover:border-orange-300/60 hover:bg-orange-500/10"
            href="/dashboard"
          >
            <span className="text-lg">Dashboard</span>
            <p className="soft-text mt-1 text-xs">Live KPI snapshot</p>
          </Link>
          <Link
            className="group rounded-xl border border-white/15 bg-white/5 p-4 text-center font-semibold hover:border-emerald-300/60 hover:bg-emerald-500/10"
            href="/students"
          >
            <span className="text-lg">Students</span>
            <p className="soft-text mt-1 text-xs">Onboarding and assignment</p>
          </Link>
          <Link
            className="group rounded-xl border border-white/15 bg-white/5 p-4 text-center font-semibold hover:border-cyan-300/60 hover:bg-cyan-500/10"
            href="/rooms"
          >
            <span className="text-lg">Rooms</span>
            <p className="soft-text mt-1 text-xs">Capacity and rent control</p>
          </Link>
          <Link
            className="group rounded-xl border border-white/15 bg-white/5 p-4 text-center font-semibold hover:border-pink-300/60 hover:bg-pink-500/10"
            href="/payments"
          >
            <span className="text-lg">Payments</span>
            <p className="soft-text mt-1 text-xs">Track monthly dues</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
