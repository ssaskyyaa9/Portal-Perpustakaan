"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import { updateUsernameAction } from "../../lib/action";
import { Inknut_Antiqua, Kaushan_Script } from "next/font/google";
import { getPeminjamanByUser, deletePeminjaman } from "../../lib/action";

const inknut = Inknut_Antiqua({ subsets: ["latin"], weight: ["400", "700"] });

function formatTanggal(tgl) {
  if (!tgl) return "-";
  try {
    return new Date(tgl).toISOString().split("T")[0];
  } catch {
    return "-";
  }
}

export default function ProfileSiswa() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [riwayat, setRiwayat] = useState([]);

  useEffect(() => {
    async function loadSession() {
      const res = await fetch("/api/auth/session");
      const data = await res.json();

      setUsername(data?.user?.name || "");
      setEmail(data?.user?.email || "");
      setUserId(data?.user?.id || "");

      if (data?.user?.id) {
        const pem = await getPeminjamanByUser(data.user.id);
        setRiwayat(pem);
      }
    }
    loadSession();
  }, []);

  async function saveChanges() {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("userId", userId);

    const res = await updateUsernameAction(formData);

    if (res.success) {
      await fetch("/api/auth/session?update", { cache: "no-store" });
      alert("Username diperbarui");
      setEditMode(false);
    } else {
      alert("Gagal update");
    }
  }

  async function handleDelete(id) {
    const ok = confirm("Yakin ingin menghapus riwayat peminjaman?");
    if (!ok) return;

    await deletePeminjaman(id);

    // refresh state
    setRiwayat((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div className="min-h-screen flex bg-[#FAF7F2]">
      <Sidebar />
      <div className="ml-[245px] w-full p-10">
        <h1 className={`${inknut.className} text-3xl font-bold mb-10`}>Halaman Profile kamu</h1>
        <div className="border border-purple-300 rounded-xl p-10 shadow-sm bg-white max-w-4xl">
          <div className="flex items-start gap-10">
            <div className="w-40 h-34 mt-4">
              <img src="./sidebar-home/account.png" alt="profile" className="w-full h-full" />
            </div>

            <div className="flex flex-col w-full gap-8">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Username</label>
                <div className="relative">
                  <input type="text" disabled={!editMode} value={username} onChange={(e) => setUsername(e.target.value)} className={`w-full border border-blue-900 rounded-full px-4 py-2 focus:outline-none ${editMode ? "bg-white" : "bg-gray-100"}`}/>

                  {!editMode && (
                    <button onClick={() => setEditMode(true)} className="absolute right-4 top-2.5">
                      <img src="./sidebar-home/edit-text.png" alt="edit" className="w-5 opacity-80 hover:opacity-100"/>
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Email</label>
                <input type="text" disabled value={email} className="w-full border border-blue-900 rounded-full px-4 py-2 bg-gray-100"/>
              </div>

              {editMode && (
                <button onClick={saveChanges} className="mt-2 w-32 bg-blue-900 text-white rounded-full py-2 hover:bg-black">Simpan</button>
              )}
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-4">Riwayat Peminjaman</h2>
        <div className="rounded-xl border border-gray-300 shadow-sm max-w-5xl">
          <table className="w-full bg-white text-center border border-[#0f1a44]">
            <thead className="bg-[#0f1a44] text-white">
              <tr>
                <th className="p-3 border border-[#0f1a44]">No</th>
                <th className="p-3 border border-[#0f1a44]">Judul Buku</th>
                <th className="p-3 border border-[#0f1a44]">Tgl Pinjam</th>
                <th className="p-3 border border-[#0f1a44]">Deadline</th>
                <th className="p-3 border border-[#0f1a44]">Tgl Kembali</th>
                <th className="p-3 border border-[#0f1a44]">Status</th>
                <th className="p-3 border border-[#0f1a44]">Aksi</th>
              </tr>
            </thead>

            <tbody className="bg-white text-center">
              {riwayat.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-3 text-gray-500">
                    Belum ada riwayat peminjaman
                  </td>
                </tr>
              )}

              {riwayat.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-100 transition border-b border-gray-300">
                  <td className="p-3 border">{index + 1}</td>
                  <td className="p-3 border">{item.judul_buku}</td>
                  <td className="p-3 border">{formatTanggal(item.tanggal_pinjam)}</td>

                  <td className="p-3 border">
                    {item.tanggal_pinjam
                      ? formatTanggal(
                        new Date(
                          new Date(item.tanggal_pinjam).setDate(
                            new Date(item.tanggal_pinjam).getDate() + 7
                          )
                        )
                      )
                      : "-"}
                  </td>

                  <td className="p-3 border">{formatTanggal(item.tanggal_dikembalikan)}</td>
                  <td className="p-3 border capitalize">{item.status}</td>

                  <td className="p-3 border">
                    <button onClick={() => handleDelete(item.id)}>
                      <img src="/hapus.png" className="w-5 opacity-80 hover:opacity-100 mx-auto" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
