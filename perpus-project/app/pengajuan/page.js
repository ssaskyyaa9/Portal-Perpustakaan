"use client";

import { useEffect, useState } from "react";
import SidebarAdminPetugas from "../components/sidebar-adp"; // ⬅️ pastikan path ini benar
import { getPeminjaman, terimaPeminjaman, tolakPeminjaman, kembalikanPeminjaman } from "../../lib/action";

export default function Pengajuan() {
  const [list, setList] = useState([]);

  function formatDate(dateValue) {
    if (!dateValue) return "-";
    try {
      return new Date(dateValue).toISOString().split("T")[0];
    } catch {
      return "-";
    }
  }

  useEffect(() => {
    async function load() {
      const data = await getPeminjaman();
      setList(data);
    }
    load();
  }, []);

  async function handleTerima(id) {
    await terimaPeminjaman(id); // stok - 1
    refreshPage();
  }

  async function handleTolak(id) {
    await tolakPeminjaman(id);
    refreshPage();
  }

  async function handleSelesai(id) {
    await kembalikanPeminjaman(id);
    refreshPage();
  }

  function refreshPage() {
    window.location.reload();
  }

  return (
    <div className="flex">
      <SidebarAdminPetugas />
      <div className="p-8 ml-[245px] w-full">
        <h1 className="text-2xl font-bold mb-6">Pengajuan Peminjaman</h1>
        <table className="w-full border">
          <thead className="bg-[#0f1a44] text-white">
            <tr>
              <th className="p-3 border">Username</th>
              <th className="p-3 border">Judul Buku</th>
              <th className="p-3 border">Peminjaman</th>
              <th className="p-3 border">Pengembalian</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {list.map((item) => (
              <tr key={item.id} className="text-center border">
                <td className="p-2">{item.username}</td>
                <td className="p-2">{item.judul_buku}</td>
                <td className="p-2">{formatDate(item.tanggal_pinjam)}</td>
                <td className="p-2">{formatDate(item.tanggal_dikembalikan)}</td>

                <td className="p-2 font-semibold">
                  {item.status === "menunggu" && (<span className="text-yellow-600">Menunggu</span>)}
                  {item.status === "dipinjam" && (<span className="text-green-600">Dipinjam</span>)}
                  {item.status === "disetujui" && (<span className="text-green-600">Disetujui</span> )}
                  {item.status === "ditolak" && (<span className="text-red-600">Ditolak</span>)}
                  {item.status === "dikembalikan" && (<span className="text-blue-600">Dikembalikan</span>)}
                </td>

                <td className="p-2 flex gap-2 justify-center">
                  {item.status === "menunggu" && (
                    <>
                      <button onClick={() => handleTerima(item.id)} className="bg-green-500 px-3 py-1 rounded text-white">Terima</button>
                      <button onClick={() => handleTolak(item.id)} className="bg-red-500 px-3 py-1 rounded text-white">Tolak</button>
                    </>
                  )}

                  {item.status === "disetujui" && (
                    <button onClick={() => handleSelesai(item.id)} className="bg-gray-400 px-3 py-1 rounded text-white">Selesai</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}