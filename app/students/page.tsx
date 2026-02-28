"use client";

import { FormEvent, useEffect, useState } from "react";

type Room = {
  id: number;
  roomNumber: string;
  capacity: number;
  occupied: number;
};

type Student = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  room: Room | null;
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    roomId: "",
  });

  async function loadData() {
    setLoading(true);
    const [studentsRes, roomsRes] = await Promise.all([
      fetch("/api/students"),
      fetch("/api/rooms"),
    ]);
    setStudents(await studentsRes.json());
    setRooms(await roomsRes.json());
    setLoading(false);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadData();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        roomId: form.roomId ? Number(form.roomId) : null,
      }),
    });

    setForm({ name: "", email: "", phone: "", roomId: "" });
    loadData();
  }

  async function deleteStudent(id: number) {
    await fetch(`/api/students/${id}`, { method: "DELETE" });
    loadData();
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold">Students</h1>
      <p className="mt-1 text-sm text-gray-600">Register and assign students.</p>

      <form onSubmit={onSubmit} className="mt-6 grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-4">
        <input
          required
          className="rounded border px-3 py-2"
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
        />
        <input
          required
          type="email"
          className="rounded border px-3 py-2"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
        />
        <input
          className="rounded border px-3 py-2"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
        />
        <select
          className="rounded border px-3 py-2"
          value={form.roomId}
          onChange={(e) => setForm((prev) => ({ ...prev, roomId: e.target.value }))}
        >
          <option value="">No room assigned</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.roomNumber} ({room.occupied}/{room.capacity})
            </option>
          ))}
        </select>
        <button className="rounded bg-black px-4 py-2 text-white md:col-span-4" type="submit">
          Add Student
        </button>
      </form>

      <div className="mt-6 overflow-hidden rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Room</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  No students found.
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id} className="border-t">
                  <td className="px-4 py-3">{student.name}</td>
                  <td className="px-4 py-3">{student.email}</td>
                  <td className="px-4 py-3">{student.phone ?? "-"}</td>
                  <td className="px-4 py-3">{student.room?.roomNumber ?? "Unassigned"}</td>
                  <td className="px-4 py-3">
                    <button
                      className="rounded border px-3 py-1 text-red-600"
                      onClick={() => deleteStudent(student.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}