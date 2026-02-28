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
      <h1 className="text-3xl font-black tracking-tight">Rooms</h1>
      <p className="soft-text mt-1 text-sm">Track room capacity and occupancy.</p>

      <form onSubmit={onSubmit} className="panel mt-6 grid gap-3 p-4 md:grid-cols-3">
        <input
          required
          className="input"
          placeholder="Room number"
          value={form.roomNumber}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, roomNumber: e.target.value }))
          }
        />
        <input
          required
          type="number"
          className="input"
          placeholder="Capacity"
          value={form.capacity}
          onChange={(e) => setForm((prev) => ({ ...prev, capacity: e.target.value }))}
        />
        <input
          required
          type="number"
          className="input"
          placeholder="Monthly rent"
          value={form.rent}
          onChange={(e) => setForm((prev) => ({ ...prev, rent: e.target.value }))}
        />
        <button className="btn-primary md:col-span-3" type="submit">
          Add Room
        </button>
      </form>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {rooms.map((room) => (
          <article key={room.id} className="panel p-4">
            <h2 className="text-lg font-bold tracking-wide">{room.roomNumber}</h2>
            <p className="soft-text mt-2 text-sm">
              Occupancy: {room.occupied}/{room.capacity}
            </p>
            <p className="soft-text text-sm">Rent: ₹{room.rent.toFixed(2)}</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                style={{ width: `${Math.min((room.occupied / room.capacity) * 100, 100)}%` }}
              />
            </div>
            <button
              className="btn-danger mt-3"
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