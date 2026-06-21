"use client";

import Image from "next/image";
import Link from "next/link";
import { Inknut_Antiqua, Kaushan_Script } from "next/font/google";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const inknut = Inknut_Antiqua({ subsets: ["latin"], weight: ["400", "700"] });
const kaushan = Kaushan_Script({ subsets: ["latin"], weight: ["400"] });

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-58 h-screen bg-[#0C1441] text-white flex flex-col justify-between p-6 fixed">
      <div>
        <h1 className={`${kaushan.className} text-3xl leading-tight text-center mt-3 mr-5`} style={{ textShadow: "3px 3px 6px #D05C81" }}> Portal<br />Perpustakaan Sekolah</h1>
        <div className={`${inknut.className} flex flex-col gap-6 mt-13 ml-3`}>
          <Link href="/homepage" className="flex items-center gap-3 hover:opacity-80 transition">
            <Image src="/sidebar-home/beranda.png" width={22} height={22} alt="home" />
            <span className={`text-[17px] font-semibold ${pathname === "/homepage" ? "border-b-2 border-white" : ""}`}>Beranda</span>
          </Link>

          <Link href="/Disukai" className="flex items-center gap-3 hover:opacity-80 transition">
            <Image src="/sidebar-home/disukai.png" width={22} height={22} alt="saved" />
            <span className={`text-[17px] font-semibold ${pathname === "/Disukai" ? "border-b-2 border-white" : ""}`}>Disukai</span>
          </Link>

          <Link href="/profilesiswa" className="flex items-center gap-3 hover:opacity-80 transition">
            <Image src="/sidebar-home/profile.png" width={22} height={22} alt="profile" />
            <span className={`text-[17px] font-semibold ${pathname === "/profilesiswa" ? "border-b-2 border-white" : ""}`}>Profile</span>
          </Link>
        </div>
      </div>

      <div className={`${inknut.className} flex items-center gap-3 px-4 pb-0.5`}>
        <Image src="/sidebar-home/keluar.png" width={22} height={22} alt="logout icon" />
        <button onClick={async () => {
          const confirmLogout = window.confirm("Yakin ingin keluar?");
          if (confirmLogout) { await signOut({ callbackUrl: "/login" }); }}}
          className="bg-red-600 px-7 py-1 rounded-lg font-semibold text-white hover:bg-red-700 transition">Keluar
        </button>
      </div>
    </div>
  );
}