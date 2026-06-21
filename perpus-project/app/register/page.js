"use client";

import Image from "next/image";
import Link from "next/link";
import { Inknut_Antiqua, Kaushan_Script } from "next/font/google";
import { register } from "../../lib/action";

const inknut = Inknut_Antiqua({ subsets: ["latin"], weight: ["400", "700"] });
const kaushan = Kaushan_Script({ subsets: ["latin"], weight: ["400"] });

export default function RegisterPage() {
  async function handleRegister(formData) {
    const res = await register(formData);

    if (!res.success) {
      alert(res.message);
      return;
    }

    localStorage.setItem("username", formData.username);
    localStorage.setItem("email", formData.email);

    alert("Daftar berhasil");
    window.location.href = "/login";
  }

  return (
    <div className={`${inknut.className} min-h-screen flex`}>
      <div className="w-1/2 bg-[#161744] text-white flex flex-col justify-center items-center px-10 relative">
        <h1 className={`${kaushan.className} text-5xl leading-tight text-center mt-3 mr-5`} style={{ textShadow: "3px 3px 6px #D05C81" }}>Portal<br />Perpustakaan Sekolah</h1>

        <div className="mt-6 relative">
          <Image src="/logo kiri.png" width={350} height={350} alt="logo" className="mt-6"/>
        </div>

        <p className="text-center mt-6 text-lg">Silakan daftar untuk mengakses koleksi<br />buku dan layanan perpustakaan.</p>
      </div>

      <div className="w-1/2 bg-white flex flex-col justify-center px-20 relative">
        <Image src="/logo-tebe.png" width={700} height={700} alt="book" className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none"/>
        <h2 className="text-3xl font-bold text-[#161744] mb-2 relative z-10 mt-5"> Selamat Datang👋</h2>
        <p className="mb-10 text-2xl text-[#161744] relative z-10">Daftarkan akun mu!</p>

        <form action={handleRegister} className="space-y-8 relative z-10">
          <div>
            <label>username</label>
            <input type="text" name="username" 
              className="w-full mt-1 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none bg-white text-black" placeholder="Masukkan username.." required/>
          </div>

          <div>
            <label>Email</label>
            <input type="email" name="email"
              className="w-full mt-1 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none bg-white text-black" placeholder="Masukkan email.." required/>
          </div>

          <div>
            <label>Password</label>
            <input type="password" name="password"
              className="w-full mt-1 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none bg-white text-black" placeholder="Masukkan password.." required/>
          </div>

          <button type="submit"
            className="w-full py-2 rounded-xl bg-[#14133B] text-white font-bold hover:bg-[#1A174D] transition-colors disabled:opacity-50"
            style={{ boxShadow: "3px 3px 6px #D05C81" }}>Daftar
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600 relative z-10">Sudah ada akun?{" "}
          <Link href="/login" className="text-[#D05C81] font-semibold">Yuk Masuk</Link>
        </p>
      </div>
    </div>
  );
}