"use client";

import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { checkUserStatus } from "../../lib/action";
import { Inknut_Antiqua, Kaushan_Script } from "next/font/google";

const inknut = Inknut_Antiqua({ subsets: ["latin"], weight: ["400", "700"] });
const kaushan = Kaushan_Script({ subsets: ["latin"], weight: ["400"] });

export default function LoginPage() {
  const router = useRouter();
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    let isProcessing = false;

    const interval = setInterval(async () => {
      if (isProcessing) return;

      const email = localStorage.getItem("pending_email");
      const password = localStorage.getItem("pending_password");
      if (!email || !password) return;

      isProcessing = true;
      try {
        const data = await checkUserStatus(email);

        if (data.status === "disetujui") {
          await signIn("credentials", { email, password, redirect: false });
          localStorage.removeItem("pending_email");
          localStorage.removeItem("pending_password");

          if (data.role === "user") router.push("/homepage");
          else if (data.role === "petugas") router.push("/dashboard");
        }
      } catch (err) {
        console.log(err);
      } finally {
        isProcessing = false;
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  async function handleLogin(formData) {
    setStatusMessage("");

    const email = formData.get("email");
    const password = formData.get("password");

    localStorage.setItem("pending_email", email);
    localStorage.setItem("pending_password", password);

    const res = await signIn("credentials", { email, password, redirect: false });

    if (res.error) {
      if (res.error === "menunggu") {
        setStatusMessage("menunggu verifikasi admin.");
        return;
      }
      if (res.error === "ditolak") {
        setStatusMessage("Akun ditolak admin.");
        return;
      }
      setStatusMessage("Email atau password salah.");
      return;
    }

    const sessionRes = await fetch("/api/auth/session");
    const session = await sessionRes.json();

    if (!session || !session.user) {
      setStatusMessage("Terjadi kesalahan, coba lagi.");
      return;
    }

    if (session.user.username) {
      localStorage.setItem("user_username", session.user.username);
    }

    if (session.user.role === "admin") router.push("/dashboard");
    else if (session.user.role === "petugas") router.push("/dashboard");
    else if (session.user.role === "user") router.push("/homepage");
  }

  return (
    <div className={`${inknut.className} min-h-screen flex`}>
      <div className="w-1/2 bg-[#161744] text-white flex flex-col justify-center items-center px-10 relative">
        <h1 className={`${kaushan.className} text-5xl leading-tight text-center mt-3 mr-5`} style={{ textShadow: "3px 3px 6px #D05C81" }}>Portal<br />Perpustakaan Sekolah</h1>

        <div className="mt-6 relative">
          <Image src="/logo kiri.png" width={350} height={350} alt="logo" />
        </div>

        <p className="text-center mt-6 text-lg">Silakan masuk untuk mengakses koleksi<br />buku dan layanan perpustakaan.</p>
      </div>

      <div className="w-1/2 bg-white flex flex-col justify-center px-20 relative">
        <Image src="/logo-tebe.png" width={700} height={700} alt="book" className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none"/>
        <h2 className="text-3xl font-bold text-[#161744] mb-2 relative z-10 -mt-12">Selamat Datang Kembali 👋</h2>
        <p className="mb-20 text-2xl text-[#161744] relative z-10">Masuk ke akunmu!</p>

        <form action={handleLogin} className="space-y-8 relative z-10">
          <div>
            <label>Email</label>
            <input type="email" name="email" 
              className="w-full mt-1 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none bg-white text-black" placeholder="Masukkan email.." required />
          </div>

          <div>
            <label>Password</label>
            <input type="password" name="password" 
              className="w-full mt-1 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none bg-white text-black" placeholder="Masukkan password.." required />
          </div>

          <button type="submit" className="w-full py-2 rounded-xl bg-[#14133B] text-white font-bold hover:bg-[#1A174D] transition-colors">Masuk</button>
        </form>

        {statusMessage && (
          <p className="mt-3 text-center font-semibold text-yellow-500">{statusMessage}</p>
        )}

        <p className="mt-4 text-center text-gray-600">Belum ada akun? 
          <Link href="/register" className="text-[#D05C81] font-semibold">Yuk daftar</Link>
        </p>
      </div>
    </div>
  );
}