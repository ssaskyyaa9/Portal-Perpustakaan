import { getBookById } from "../.../../../../lib/action";
import { Inknut_Antiqua } from "next/font/google";
import Sidebar from "../../components/sidebar";
import BookCardDetail from "../../components/bookcarddetail";
import Link from "next/link";

const inknut = Inknut_Antiqua({ subsets: ["latin"], weight: ["400", "700"] });

export default async function DetailBuku({ params }) {
  const { id } = await params;
  const book = await getBookById(id);

  if (!book) {
    return <div className="p-10 text-center">Buku tidak ditemukan.</div>;
  }
  
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="ml-[245px] p-8">
        <div className="flex items-center mb-5">
          <Link href="/homepage" className="p-2 hover:opacity-80 transition">
            <img src="/sidebar-dash/back-button.png" alt="back" className="w-7 h-7"/>
          </Link>

          <h1 className={`${inknut.className} text-2xl font-semibold ml-5`}>Detail Buku</h1>
        </div>

        <BookCardDetail book={book} />
      </div>
    </div>
  );
}