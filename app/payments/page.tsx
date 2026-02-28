"use client";

import { FormEvent, useEffect, useState } from "react";

type Student = {
  id: number;
  name: string;
  room: { roomNumber: string } | null;
};

type Payment = {
  id: number;
  amount: number;
  dueDate: string;
  status: "PENDING" | "PAID" | "OVERDUE";
  student: { name: string };
  room: { roomNumber: string } | null;
};

const STATUSES = ["PENDING", "PAID", "OVERDUE"] as const;

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [form, setForm] = useState({
    studentId: "",
    amount: "",
    dueDate: "",
    status: "PENDING",
  });

  async function loadData() {
    const [paymentsRes, studentsRes] = await Promise.all([
      fetch("/api/payments"),
      fetch("/api/students"),
    ]);
    setPayments(await paymentsRes.json());
    setStudents(await studentsRes.json());
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadData();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: Number(form.studentId),
        amount: Number(form.amount),
        dueDate: form.dueDate,
        status: form.status,
      }),
    });
    setForm({ studentId: "", amount: "", dueDate: "", status: "PENDING" });
    loadData();
  }

  async function updateStatus(id: number, status: string) {
    await fetch(`/api/payments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadData();
  }

  async function deletePayment(id: number) {
    await fetch(`/api/payments/${id}`, { method: "DELETE" });
    loadData();
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold">Payments</h1>
      <p className="mt-1 text-sm text-gray-600">Manage hostel fee payments.</p>

      <form onSubmit={onSubmit} className="mt-6 grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-4">
        <select
          required
          className="rounded border px-3 py-2"
          value={form.studentId}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, studentId: e.target.value }))
          }
        >
          <option value="">Select student</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name} {student.room ? `(${student.room.roomNumber})` : ""}
            </option>
          ))}
        </select>
        <input
          required
          type="number"
          className="rounded border px-3 py-2"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
        />
        <input
          required
          type="date"
          className="rounded border px-3 py-2"
          value={form.dueDate}
          onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))}
        />
        <select
          className="rounded border px-3 py-2"
          value={form.status}
          onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
        >
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <button className="rounded bg-black px-4 py-2 text-white md:col-span-4" type="submit">
          Add Payment
        </button>
      </form>

      <div className="mt-6 overflow-hidden rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Room</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Due Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  No payments found.
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.id} className="border-t">
                  <td className="px-4 py-3">{payment.student.name}</td>
                  <td className="px-4 py-3">{payment.room?.roomNumber ?? "-"}</td>
                  <td className="px-4 py-3">₹{payment.amount.toFixed(2)}</td>
                  <td className="px-4 py-3">{payment.dueDate.slice(0, 10)}</td>
                  <td className="px-4 py-3">
                    <select
                      className="rounded border px-2 py-1"
                      value={payment.status}
                      onChange={(e) => updateStatus(payment.id, e.target.value)}
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      className="rounded border px-3 py-1 text-red-600"
                      onClick={() => deletePayment(payment.id)}
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