"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BookCard({ id, judul, penulis, kategori, stok, cover_url }) {
  const [liked, setLiked] = useState(false);
  const router = useRouter();

  const handleLike = () => setLiked(!liked);
  const handleDetail = () => {
    if (!id) {
      console.error("ID buku undefined!");
      return;
    }
    console.log("ID klik:", id);
    router.push(`/detail-buku/${id}`);
  };

  return (
    <div className="w-[300px] h-[180px] bg-[#161744] text-white rounded-xl shadow flex gap-3 p-3 relative hover:shadow-lg transition">
      <Image src={cover_url} width={90} height={120} alt={judul} className="rounded-md object-cover"/>

      <div className="flex flex-col justify-between flex-1">
        <div>
          <h3 className="font-bold text-[18px] leading-5">{judul}</h3>
          <p className="text-sm mt-3">Penulis: {penulis}</p>
          <p className="text-sm mt-1">kategori: {kategori}</p>
          <p className="text-[11px] bg-white text-black px-3 py-0.5 rounded-full font-semibold mt-3 w-fit">Stok {stok}</p>
        </div>

        <button onClick={handleDetail}
          className="px-8 py-1 rounded-full font-semibold bg-white text-[#161744] text-[15px] border border-[#161744] shadow-[0_4px_12px_rgba(255,192,203,0.5)] hover:shadow-[0_6px_15px_rgba(255,192,203,0.7)] transition w-fit">Detail Buku
        </button>
      </div>

      <button onClick={handleLike} className="absolute bottom-4 right-3">
        {liked ? (
          <Heart className="w-6 h-6 text-white fill-white" />
        ) : (
          <Heart className="w-6 h-6 text-white" />
        )}
      </button>
    </div>
  );
}