"use client";

import { FormEvent, useEffect, useState } from "react";

type Room = {
  id: number;
  roomNumber: string;
  capacity: number;
  occupied: number;
  rent: number;
};

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [form, setForm] = useState({ roomNumber: "", capacity: "", rent: "" });

  async function loadData() {
    const response = await fetch("/api/rooms");
    setRooms(await response.json());
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadData();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await fetch("/api/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomNumber: form.roomNumber,
        capacity: Number(form.capacity),
        rent: Number(form.rent),
      }),
    });
    setForm({ roomNumber: "", capacity: "", rent: "" });
    loadData();
  }

  async function deleteRoom(id: number) {
    await fetch(`/api/rooms/${id}`, { method: "DELETE" });
    loadData();
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold">Rooms</h1>
      <p className="mt-1 text-sm text-gray-600">Track room capacity and occupancy.</p>

      <form onSubmit={onSubmit} className="mt-6 grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-3">
        <input
          required
          className="rounded border px-3 py-2"
          placeholder="Room number"
          value={form.roomNumber}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, roomNumber: e.target.value }))
          }
        />
        <input
          required
          type="number"
          className="rounded border px-3 py-2"
          placeholder="Capacity"
          value={form.capacity}
          onChange={(e) => setForm((prev) => ({ ...prev, capacity: e.target.value }))}
        />
        <input
          required
          type="number"
          className="rounded border px-3 py-2"
          placeholder="Monthly rent"
          value={form.rent}
          onChange={(e) => setForm((prev) => ({ ...prev, rent: e.target.value }))}
        />
        <button className="rounded bg-black px-4 py-2 text-white md:col-span-3" type="submit">
          Add Room
        </button>
      </form>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {rooms.map((room) => (
          <article key={room.id} className="rounded-xl border bg-white p-4">
            <h2 className="text-lg font-semibold">{room.roomNumber}</h2>
            <p className="mt-2 text-sm text-gray-600">
              Occupancy: {room.occupied}/{room.capacity}
            </p>
            <p className="text-sm text-gray-600">Rent: ₹{room.rent.toFixed(2)}</p>
            <button
              className="mt-3 rounded border px-3 py-1 text-red-600"
              onClick={() => deleteRoom(room.id)}
            >
              Delete
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}