import Sidebar from "../components/sidebar";
import { Inknut_Antiqua } from "next/font/google";
import BookCard from "../components/bookcard";
import { getLikedBooks } from "../../lib/action";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

const inknut = Inknut_Antiqua({ subsets: ["latin"], weight: ["400", "700"] });

export default async function Disukai() {

  const session = await getServerSession(authOptions);
  const user_email = session?.user?.email;

  const books = await getLikedBooks(user_email);

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="ml-[245px] p-8 bg-gray-50">
        <h1 className={`${inknut.className} text-2xl font-bold`}>Kumpulan buku yang kamu sukai</h1>
        <p className={`${inknut.className} text-lg mt-3`}>Yuk pinjam buku yang ada disini</p>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {books.map(b => (
            <BookCard
              key={b.id}
              id={b.id}
              judul={b.judul}
              penulis={b.penulis}
              kategori={b.kategori}
              stok={b.stok}
              cover_url={b.cover_url}
            />
          ))}
        </div>
      </div>
    </div>
  );
}