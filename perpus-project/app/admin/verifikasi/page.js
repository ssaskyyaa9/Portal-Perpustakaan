"use client";

import { useEffect, useState } from "react";
import { getPendingUsers, approveUser, rejectUser } from "../../../lib/action";
import { useRouter } from "next/navigation";
import SidebarAdminPetugas from "../../components/sidebar-adp";
import { Inknut_Antiqua } from "next/font/google";

const inknut = Inknut_Antiqua({ subsets: ["latin"], weight: ["400", "700"] });

export default function VerifikasiPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const data = await getPendingUsers();
      setUsers(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const data = await getPendingUsers();
      setUsers(data);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  async function handleApprove(id) {
    const res = await approveUser(id);
    if (res.success) {
      alert("User disetujui");
      setUsers(users.filter((u) => u.id !== id));
    }
  }

  async function handleReject(id) {
    const res = await rejectUser(id);
    if (res.success) {
      alert("User ditolak");
      setUsers(users.filter((u) => u.id !== id));
    }
  }

  if (loading) {
    return (
      <div className="p-5 text-center text-xl font-semibold ml-[245px]">Memuat data...</div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <SidebarAdminPetugas />
      <div className="ml-[245px] p-10 w-full bg-gray-50">
        <h1 className={`${inknut.className} text-3xl font-bold mb-6`}>Verifikasi Pengguna</h1>

        {users.length === 0 ? (
          <p className="text-gray-500">Tidak ada user yang menunggu verifikasi.</p>
        ) : (
          <table className="w-full bg-white text-center border border-[#0f1a44]">
            <thead className="bg-[#0f1a44] text-white">
              <tr>
                <th className="p-3 border border-[#0f1a44]">ID</th>
                <th className="p-3 border border-[#0f1a44]">Username</th>
                <th className="p-3 border border-[#0f1a44]">Email</th>
                <th className="p-3 border border-[#0f1a44]">Role</th>
                <th className="p-3 border border-[#0f1a44]">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white text-center">
              
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-100 transition border-b border-gray-300">
                  <td className="p-3 text-center border border-gray-300">{user.id}</td>
                  <td className="p-3 border border-gray-300">{user.username}</td>
                  <td className="p-3 border border-gray-300">{user.email}</td>
                  <td className="p-3 border border-gray-300 text-center">{user.role}</td>
                  <td className="p-3 text-center border border-gray-300">
                    <button onClick={() => handleApprove(user.id)} className="px-3 py-1 bg-green-600 text-white rounded mr-2">Setujui</button>
                    <button onClick={() => handleReject(user.id)} className="px-3 py-1 bg-red-600 text-white rounded">Tolak</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}