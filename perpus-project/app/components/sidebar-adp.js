"use client";

import Image from "next/image";
import Link from "next/link";
import { Inknut_Antiqua, Kaushan_Script } from "next/font/google";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

const inknut = Inknut_Antiqua({ subsets: ["latin"], weight: ["400", "700"] });
const kaushan = Kaushan_Script({ subsets: ["latin"], weight: ["400"] });

export default function SidebarAdminPetugas() {
  const pathname = usePathname();
  const [role, setRole] = useState("");

  useEffect(() => {
    async function loadRole() {
      const res = await fetch("/api/auth/session?update", { cache: "no-store" });
      const data = await res.json();
      setRole(data?.user?.role || "");
    }
    loadRole();
  }, []);

  return (
    <div className="w-58 h-screen bg-[#0C1441] text-white flex flex-col justify-between p-6 fixed">
      <div>
        <h1 className={`${kaushan.className} text-3xl leading-tight text-center mt-3 mr-5`} style={{ textShadow: "3px 3px 6px #D05C81" }}>Portal<br />Perpustakaan Sekolah</h1>
        <div className={`${inknut.className} flex flex-col gap-6 mt-13 ml-3`}>

          {role === "petugas" && (
            <Link href="/profilepetugas" className="flex items-center gap-3 hover:opacity-80 transition">
              <Image src="/sidebar-dash/profile.png" width={22} height={22} alt="profilepetugas" />
              <span className={`text-[17px] font-semibold ${pathname === "/profilepetugas" ? "border-b-2 border-white" : ""}`}>Profile</span>
            </Link>
          )}

          <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition">
            <Image src="/sidebar-dash/dashboard.png" width={22} height={22} alt="dashboard" />
            <span className={`text-[17px] font-semibold ${pathname === "/dashboard" ? "border-b-2 border-white" : ""}`}>Dashboard</span>
          </Link>

          <Link href="/data-buku" className="flex items-center gap-3 hover:opacity-80 transition">
            <Image src="/sidebar-dash/databuku.png" width={22} height={22} alt="databuku" />
            <span className={`text-[17px] font-semibold ${pathname === "/databuku" ? "border-b-2 border-white" : ""}`}>Data buku</span>
          </Link>

          <Link href="/tambah-buku" className="flex items-center gap-3 hover:opacity-80 transition">
            <Image src="/sidebar-dash/tambahbuku.png" width={22} height={22} alt="tambahbuku" />
            <span className={`text-[17px] font-semibold ${pathname === "/tambahbuku" ? "border-b-2 border-white" : ""}`}>Tambah buku</span>
          </Link>

          <Link href="/pengajuan" className="flex items-center gap-3 hover:opacity-80 transition">
            <Image src="/sidebar-dash/pengajuan.png" width={22} height={22} alt="pengajuan" />
            <span className={`text-[17px] font-semibold ${pathname === "/pengajuan" ? "border-b-2 border-white" : ""}`}>Pengajuan</span>
          </Link>

          {/* === FITUR KHUSUS ADMIN === */}
          {role === "admin" && (
            <>
              <Link href="/admin/kelola-user" className="flex items-center gap-3 hover:opacity-80 transition">
                <Image src="/sidebar-dash/kelolauser.png" width={22} height={22} alt="kelola user" />
                <span className={`text-[17px] font-semibold ${pathname.startsWith("/admin/kelola-user") ? "border-b-2 border-white" : ""}`}>Kelola User</span>
              </Link>

              <Link href="/admin/verifikasi" className="flex items-center gap-3 hover:opacity-80 transition">
                <Image src="/sidebar-dash/verifikasi.png" width={22} height={22} alt="verifikasi" />
                <span className={`text-[17px] font-semibold ${pathname.startsWith("/admin/verifikasi") ? "border-b-2 border-white" : ""}`}>Verifikasi</span>
              </Link>
            </>
          )}
        </div>
      </div>

      {role === "petugas" && (
        <div className={`${inknut.className} flex items-center gap-3 px-4 pb-0.5`}>
          <Image src="/sidebar-dash/keluar.png" width={22} height={22} alt="logout icon" />
          <button onClick={() => { if (confirm("Yakin ingin keluar?")) {signOut({ callbackUrl: "/login" });}}}
            className="bg-red-600 px-7 py-1 rounded-lg font-semibold text-white hover:bg-red-700 transition">Keluar
          </button>
        </div>
      )}
    </div>
  );
}