"use client";

import { useEffect, useState } from "react";
import SidebarAdminPetugas from "../../components/sidebar-adp";
import { getAllVerifiedUsers, deleteUser, searchUsers, addUser, updateUser } from "../../../lib/action";
import { Inknut_Antiqua } from "next/font/google";

const inknut = Inknut_Antiqua({ subsets: ["latin"], weight: ["400", "700"] });

export default function KelolaUserPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "petugas",
  });

  const [editData, setEditData] = useState({
    id: "",
    username: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    const data = await getAllVerifiedUsers();
    const filtered = data.filter((u) => u.role !== "admin");
    const sorted = filtered.sort((a, b) => b.id - a.id);
    setUsers(sorted);
  }

  async function handleDelete(id) {
    if (confirm("Yakin hapus user ini?")) {
      await deleteUser(id);
      loadUsers();
    }
  }

  async function handleSearch(e) {
    const keyword = e.target.value;
    setSearch(keyword);

    if (keyword.trim() === "") return loadUsers();

    const result = await searchUsers(keyword);
    const filtered = result.filter((u) => u.role !== "admin");
    setUsers(filtered);
  }

  async function handleCreate(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", form.username);
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("role", form.role);

    await addUser(formData);

    setShowModal(false);
    setForm({ username: "", email: "", password: "", role: "petugas" });
    loadUsers();
    alert("Akun berhasil ditambahkan!");
  }

  function openEditPopup(user) {
    setEditData({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
    setShowEditModal(true);
  }

  async function saveEdit(e) {
    e.preventDefault();
    await updateUser(editData.id, editData);
    setShowEditModal(false);
    loadUsers();
    alert("Akun berhasil diperbarui!");
  }

  return (
    <div className="min-h-screen flex">
      <SidebarAdminPetugas />
      <div className="ml-[245px] p-10 w-full bg-gray-50">
        <h1 className={`${inknut.className} text-3xl font-bold mb-6`}>Kelola User</h1>

        <div className="flex justify-between mb-4">
          <input type="text" placeholder="Cari username..." value={search} onChange={handleSearch} className="px-4 py-2 border rounded w-72"/>
          <button onClick={() => setShowModal(true)} className="bg-[#0f1a44] text-white px-4 py-2 rounded"> Tambah Akun</button>
        </div>

        <table className="w-full bg-white text-center border border-[#0f1a44]">
          <thead className="bg-[#0f1a44] text-white">
            <tr>
              <th className="p-3 border border-[#0f1a44]">No</th>
              <th className="p-3 border border-[#0f1a44]">Username</th>
              <th className="p-3 border border-[#0f1a44]">Email</th>
              <th className="p-3 border border-[#0f1a44]">Role</th>
              <th className="p-3 border border-[#0f1a44]">Aksi</th>
            </tr>
          </thead>

          <tbody className="bg-white text-center">
            {users.map((u, i) => (
              <tr key={u.id} className="hover:bg-gray-100 transition border-b border-gray-300">
                <td className="p-3 border">{users.length - i}</td>
                <td className="p-3 border">{u.username}</td>
                <td className="p-3 border">{u.email}</td>
                <td className="p-3 border">{u.role}</td>
                <td className="p-3 border">
                  <div className="flex gap-5 justify-center">
                    <button onClick={() => openEditPopup(u)}>
                      <img src="/sidebar-dash/edit.png" className="w-5 cursor-pointer" />
                    </button>
                    <button onClick={() => handleDelete(u.id)}>
                      <img src="/hapus.png" className="w-5 cursor-pointer" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showModal && (
          <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/40">
            <form onSubmit={handleCreate} className="bg-white p-6 rounded shadow-xl w-[380px]">
              <h2 className="text-xl font-bold mb-4 text-center">Tambah Akun</h2>

              <input type="text" required placeholder="Username"
                className="border p-2 w-full mb-3"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />

              <input type="email" required placeholder="Email"
                className="border p-2 w-full mb-3"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <input type="password" required placeholder="Password"
                className="border p-2 w-full mb-3"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />

              <select className="border p-2 w-full mb-4"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="petugas">Petugas</option>
                <option value="user">User</option>
              </select>

              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-3 py-1 border rounded">Batal</button>
                <button type="submit" className="px-3 py-1 bg-[#0f1a44] text-white rounded">Simpan</button>
              </div>
            </form>
          </div>
        )}

        {showEditModal && (
          <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/40">
            <form onSubmit={saveEdit} className="bg-white p-6 rounded shadow-xl w-[380px]">
              <h2 className="text-xl font-bold mb-4 text-center">Edit Akun</h2>

              <input type="text" required className="border p-2 w-full mb-3"
                value={editData.username}
                onChange={(e) => setEditData({ ...editData, username: e.target.value })}
              />

              <input type="email" required className="border p-2 w-full mb-3"
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
              />

              <select className="border p-2 w-full mb-4" value={editData.role} onChange={(e) => setEditData({ ...editData, role: e.target.value })}>
                <option value="petugas">Petugas</option>
                <option value="user">User</option>
              </select>

              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-3 py-1 border rounded">Batal</button>
                <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">Simpan</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}