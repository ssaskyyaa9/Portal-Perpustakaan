"use client";

import Sidebar from "../components/sidebar";
import BookCard from "../components/bookcard";
import { useEffect, useState } from "react";
import { getBooks } from "../../lib/action";

export default function Homepage() {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [books, setBooks] = useState([]);

  useEffect(() => {
    async function loadSession() {
      const res = await fetch("/api/auth/session?update", { cache: "no-store" });
      const data = await res.json();

      setUsername(data?.user?.name || "");
      setRole(data?.user?.role || "");
    }
    loadSession();

    // popup verifikasi
    setTimeout(() => {
      const popup = localStorage.getItem("verified_popup");
      if (popup === "yes") {
        alert("Akun kamu berhasil diverifikasi!");
        localStorage.removeItem("verified_popup");
      }
    }, 300);
  }, []);

  useEffect(() => {
    async function loadBooks() {
      const result = await getBooks();
      setBooks(result || []); 
    }
    loadBooks();
  }, []);

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="ml-[245px] p-8 bg-gray-50">
        <div className="flex justify-between items-center mb-8">
          <div><h1 className="text-2xl font-bold">Selamat Datang, {username}👋</h1></div>
          <div className="text-sm text-gray-600"> Anda masuk sebagai <span className="font-bold">{role}</span></div>
        </div>

        <div className="mb-6">
          <input type="text" placeholder="Cari Buku..." className="w-full p-3 border rounded-xl shadow-sm focus:outline-blue-500" />
        </div>

        <div className="flex gap-21 mb-8 overflow-x-auto whitespace-nowrap py-1">
          <span className="bg-white px-6 py-2 rounded-xl shadow text-sm">✨ Fiksi</span>
          <span className="bg-white px-6 py-2 rounded-xl shadow text-sm">💗 Romance</span>
          <span className="bg-white px-6 py-2 rounded-xl shadow text-sm">📜 Sejarah</span>
          <span className="bg-white px-6 py-2 rounded-xl shadow text-sm">📘 Mata Pelajaran</span>
          <span className="bg-white px-6 py-2 rounded-xl shadow text-sm">🔭 Sains</span>
        </div>

        <h2 className="text-xl font-semibold mb-4">Daftar Buku</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((b) => (
            <BookCard key={b.id} id={b.id} judul={b.judul} penulis={b.penulis} kategori={b.kategori} stok={b.stok} cover_url={b.cover_url} detail={b.detail} />
          ))}
        </div>
      </div>
    </div>
  );
}