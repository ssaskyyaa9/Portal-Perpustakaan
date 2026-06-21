"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { pinjamBuku, likeBook, unlikeBook, getLikedBooks } from "../../lib/action";
import { useSession } from "next-auth/react";

export default function BookCardDetail({ book }) {
  const { data: session } = useSession();
  const user_email = session?.user?.email;

  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function cekAwal() {
      if (!user_email) return;

      const likedList = await getLikedBooks(user_email);
      const sudahLike = likedList.some((item) => item.id === book.id);

      setLiked(sudahLike);
    }

    cekAwal();
  }, [user_email, book.id]);

  async function handleLike() {
    if (!user_email) return alert("Harus login terlebih dahulu.");

    const newState = !liked;
    setLiked(newState);

    if (newState) {
      await likeBook({ user_email, book_id: book.id });
    } else {
      await unlikeBook({ user_email, book_id: book.id });
    }
  }

  async function handlePinjam() {
    setLoading(true);

    const res = await pinjamBuku({ book_id: book.id });
    alert(res.message);

    setLoading(false);
  }

  return (
    <div className="bg-[#161744] text-white p-6 rounded-2xl w-full max-w-[900px] flex gap-10 relative">
      <button onClick={handleLike} className="absolute right-6 top-6">
        {liked ? (
          <Heart className="w-7 h-7 text-white" style={{ fill: "white", stroke: "white", strokeWidth: 1.5 }}/>
        ) : (
          <Heart className="w-7 h-7 text-white" />
        )}
      </button>

      <div className="flex flex-col items-center gap-4">
        <Image src={book.cover_url} alt={book.judul} width={240} height={200} className="rounded-lg shadow-lg object-cover"/>

        <button onClick={handlePinjam} disabled={loading} className="w-[250px] py-2 bg-white text-[#161744] font-semibold rounded-full shadow-[0_4px_12px_rgba(255,192,203,0.5)] hover:shadow-[0_6px_15px_rgba(255,192,203,0.7)] transition">
          {loading ? "Memproses..." : "Pinjam"}
        </button>
      </div>

      <div className="flex-1 space-y-3 mt-4">
        <h2 className="text-[22px] font-bold">{book.judul}</h2>
        <p><strong>Penulis:</strong> {book.penulis}</p>
        <p><strong>Genre:</strong> {book.kategori}</p>
        <p className="px-3 py-1 bg-white text-black rounded-full inline-block mt-2 font-semibold text-[13px]">Stock {book.stok}</p>

        <div className="mt-4">
          <h3 className="font-bold mb-2">Sinopsis</h3>
          <p className="text-gray-300 leading-relaxed">{book.sinopsis}</p>
        </div>
      </div>
    </div>
  );
}