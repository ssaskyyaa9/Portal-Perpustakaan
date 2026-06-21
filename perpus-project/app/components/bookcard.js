"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { likeBook, unlikeBook, getLikedBooks } from "../../lib/action";
import { useSession } from "next-auth/react";

export default function BookCard({ id, judul, penulis, kategori, stok, cover_url }) {
  const router = useRouter();
  const { data: session } = useSession();
  const user_email = session?.user?.email;

  const [liked, setLiked] = useState(false);

  useEffect(() => {
    async function cekAwal() {
      if (!user_email) return;

      const likedList = await getLikedBooks(user_email);
      const sudahLike = likedList.some((item) => item.id === id);

      setLiked(sudahLike);
    }

    cekAwal();
  }, [user_email, id]);

  async function handleLike() {
    if (!user_email) return alert("Harus login terlebih dahulu.");

    const newStatus = !liked;
    setLiked(newStatus);

    if (newStatus) {
      await likeBook({ user_email, book_id: id });
    } else {
      await unlikeBook({ user_email, book_id: id });
      router.refresh();
    }
  }

  const handleDetail = () => {
    if (!id) {
      console.error("ID buku undefined!");
      return;
    }
    router.push(`/detail-buku/${id}`);
  };

  return (
    <div className="w-[300px] h-[180px] bg-[#161744] text-white rounded-xl shadow flex gap-3 p-3 relative hover:shadow-lg transition">
      <Image src={cover_url} width={90} height={120} alt={judul} className="rounded-md object-cover"/>

      <div className="flex flex-col justify-between flex-1">
        <div>
          <h3 className="font-bold text-[18px] leading-5">{judul}</h3>
          <p className="text-sm mt-3">Penulis: {penulis}</p>
          <p className="text-sm mt-1">Kategori: {kategori}</p>
          <p className="text-[11px] bg-white text-black px-3 py-0.5 rounded-full font-semibold mt-3 w-fit">Stok {stok}</p>
        </div>

        <button onClick={handleDetail}
          className="px-8 py-1 rounded-full font-semibold bg-white text-[#161744] text-[15px] border border-[#161744] shadow-[0_4px_12px_rgba(255,192,203,0.5)] hover:shadow-[0_6px_15px_rgba(255,192,203,0.7)] transition w-fit">Detail Buku
        </button>
      </div>

      <button onClick={handleLike} className="absolute bottom-4 right-3">
        {liked ? (
          <Heart className="w-6 h-6 text-white" style={{ fill: "white", stroke: "white", strokeWidth: 1.5 }}/>
        ) : (
          <Heart className="w-6 h-6 text-white" />
        )}
      </button>
    </div>
  );
}