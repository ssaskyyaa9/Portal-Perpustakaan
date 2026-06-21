"use client";
import { useEffect, useState } from "react";
import { getBooks, deleteBook } from "../../lib/action";
import { useRouter } from "next/navigation";
import SidebarAdminPetugas from "../components/sidebar-adp";
import { Inknut_Antiqua } from "next/font/google";

const inknut = Inknut_Antiqua({ subsets: ["latin"], weight: ["400", "700"] });

export default function DataBuku() {
  const router = useRouter();
  const [books, setBooks] = useState([]);

  async function load() {
    const data = await getBooks();
    setBooks(data);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen">
      <SidebarAdminPetugas />

      <div className="ml-[245px] p-10">
        <h1 className={`${inknut.className} text-3xl font-bold mb-6`}>Data Buku Perpustakaan</h1>
        <div className="mb-5">
          <input type="text" placeholder="mencari data buku perpustakaan" className="w-[350px] p-2 border border-gray-300 rounded-lg shadow-sm"/>
        </div>

        <div className="border border-[#0f1a44] rounded-lg overflow-hidden shadow-md w-[98%]">
          <table className="w-full">
            <thead className="bg-[#0f1a44] text-white">
              <tr>
                <th className="p-3 border border-[#0f1a44]">No</th>
                <th className="p-3 border border-[#0f1a44]">Judul Buku</th>
                <th className="p-3 border border-[#0f1a44]">Penulis</th>
                <th className="p-3 border border-[#0f1a44]">Rak</th>
                <th className="p-3 border border-[#0f1a44]">Stok</th>
                <th className="p-3 border border-[#0f1a44]">Aksi</th>
              </tr>
            </thead>

            <tbody className="bg-white text-align:center items-center text-center border">
              {books.map((b, i) => (
                <tr key={b.id} className="hover:bg-gray-100 transition border-b border-gray-300">
                  <td className="p-3 text-center border border-gray-300">{i + 1}</td>
                  <td className="p-3 border border-gray-300">{b.judul}</td>
                  <td className="p-3 border border-gray-300">{b.penulis}</td>
                  <td className="p-3 border border-gray-300">{b.lokasi_rak}</td>
                  <td className="p-3 border border-gray-300">{b.stok}</td>

                  <td className="p-3 flex gap-4 justify-center">
                    <button onClick={() => router.push(`/tambah-buku?id=${b.id}`)}>
                      <img src="/sidebar-dash/edit.png" alt="Edit" className="w-5 h-5 hover:opacity-70"/>
                    </button>

                    <button onClick={async () => { await deleteBook(b.id); load(); }}>
                      <img src="/hapus.png" alt="Delete"className="w-5 h-5 hover:opacity-70"/>
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