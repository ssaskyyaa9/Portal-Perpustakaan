"use client";

import SidebarAdminPetugas from "../components/sidebar-adp";
import { useEffect, useState } from "react";
import { getDashboardData, getPeminjaman } from "../../lib/action";

export default function Dashboard() {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [stats, setStats] = useState({ box1: 0, box2: 0, box3: 0 });

  // data peminjaman
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [tanggal, setTanggal] = useState("");

  // format tanggal agar rapi
  function formatDate(val) {
    if (!val) return "-";
    try {
      return new Date(val).toISOString().split("T")[0];
    } catch {
      return "-";
    }
  }

  useEffect(() => {
    async function loadSession() {
      const res = await fetch("/api/auth/session?update", { cache: "no-store" });
      const data = await res.json();

      const r = data?.user?.role || "";
      setUsername(data?.user?.name || "");
      setRole(r);

      if (r) {
        const s = await getDashboardData(r);
        setStats(s);
      }

      // ambil data peminjaman
      const pinjam = await getPeminjaman();
      setList(pinjam);
    }

    loadSession();
  }, []);

  // filter + search
  const filteredList = list.filter((item) => {
    const matchSearch =
      item.username.toLowerCase().includes(search.toLowerCase()) ||
      item.judul_buku.toLowerCase().includes(search.toLowerCase());

    const matchTanggal = tanggal
      ? formatDate(item.tanggal_pinjam) === tanggal
      : true;

    return matchSearch && matchTanggal;
  });

  return (
    <div className="min-h-screen">
      <SidebarAdminPetugas/>

      <div className="ml-[245px] p-8 bg-gray-50">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold"> Selamat Datang, {username} 👋 </h1>
          <div className="text-sm text-gray-600"> Anda masuk sebagai <span className="font-bold">{role}</span> </div>
        </div>

        {/* 3 Kotak Statistik */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="bg-pink-300 p-6 rounded-xl text-center">
            <h2 className="text-2xl font-bold">{stats.box1}</h2>
            <p>{role === "admin" ? "Total Akun" : "Total Buku"}</p>
          </div>

          <div className="bg-pink-300 p-6 rounded-xl text-center">
            <h2 className="text-2xl font-bold">{stats.box2}</h2>
            <p>{role === "admin" ? "Akun Terverifikasi" : "Sedang Dipinjam"}</p>
          </div>

          <div className="bg-pink-300 p-6 rounded-xl text-center">
            <h2 className="text-2xl font-bold">{stats.box3}</h2>
            <p>{role === "admin" ? "Akun Pending" : "Stok Tersedia"}</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder="Cari nama / judul buku..."
            className="border px-3 py-2 rounded w-72"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <input
            type="date"
            className="border px-3 py-2 rounded"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
          />
        </div>

        {/* Tabel Peminjaman */}
        <table className="w-full border">
          <thead className="bg-[#0f1a44] text-white">
            <tr>
              <th className="p-3 border">Username</th>
              <th className="p-3 border">Judul Buku</th>
              <th className="p-3 border">Pinjam</th>
              <th className="p-3 border">Kembali</th>
              <th className="p-3 border">Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredList.map((item) => (
              <tr key={item.id} className="text-center border">
                <td className="p-2">{item.username}</td>
                <td className="p-2">{item.judul_buku}</td>
                <td className="p-2">{formatDate(item.tanggal_pinjam)}</td>
                <td className="p-2">{formatDate(item.tanggal_dikembalikan)}</td>

                <td className="p-2 font-semibold">
                  {item.status === "menunggu" && <span className="text-yellow-600">Menunggu</span>}
                  {item.status === "disetujui" && <span className="text-green-600">Disetujui</span>}
                  {item.status === "dipinjam" && <span className="text-green-600">Dipinjam</span>}
                  {item.status === "ditolak" && <span className="text-red-600">Ditolak</span>}
                  {item.status === "dikembalikan" && <span className="text-blue-600">Dikembalikan</span>}
                </td>
              </tr>
            ))}

            {filteredList.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500"> Tidak ada data </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}