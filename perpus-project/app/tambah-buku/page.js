"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { addBook, getBookById, updateBook } from "../../lib/action";
import SidebarAdminPetugas from "../components/sidebar-adp";
import { Inknut_Antiqua } from "next/font/google";

const inknut = Inknut_Antiqua({ subsets: ["latin"], weight: ["400", "700"] });

export default function TambahBuku() {
  const router = useRouter();
  const params = useSearchParams();
  const editId = params.get("id");

  const [form, setForm] = useState({
    judul: "",
    penulis: "",
    kategori: "",
    cover_url: "",
    stok: "",
    lokasi_rak: "",
    sinopsis: "",
  });

  useEffect(() => {
    async function loadBook() {
      if (editId) {
        const book = await getBookById(Number(editId));
        if (book) setForm(book);
      }
    }
    loadBook();
  }, [editId]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (editId) {
      await updateBook(Number(editId), form);
    } else {
      await addBook(form);
    }

    router.push("/data-buku");
  }

  return (
    <div className="min-h-screen">
      <SidebarAdminPetugas />
      <div className="ml-[245px] p-8">
        <h1 className={`${inknut.className} text-2xl font-semibold mb-5`}>Tambahkan Buku</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
          <input name="judul" value={form.judul} onChange={handleChange} placeholder="Judul Buku" className="border p-3 rounded-lg" />
          <input name="penulis" value={form.penulis} onChange={handleChange} placeholder="Penulis" className="border p-3 rounded-lg" />
          <input name="kategori" value={form.kategori} onChange={handleChange} placeholder="Kategori / Genre" className="border p-3 rounded-lg" />
          <input name="cover_url" value={form.cover_url} onChange={handleChange} placeholder="URL Cover" className="border p-3 rounded-lg" />
          <input name="stok" value={form.stok} onChange={handleChange} placeholder="Stok" className="border p-3 rounded-lg" />
          <input name="lokasi_rak" value={form.lokasi_rak} onChange={handleChange} placeholder="Lokasi Rak" className="border p-3 rounded-lg" />
          <textarea name="sinopsis" value={form.sinopsis} onChange={handleChange} placeholder="Sinopsis" className="border p-3 rounded-lg h-28" />
          <button type="submit" className="bg-[#0f1a44] text-white rounded-xl py-3 mt-3">{editId ? "Simpan Perubahan" : "Selesai"}</button>
        </form>
      </div>
    </div>
  );
}