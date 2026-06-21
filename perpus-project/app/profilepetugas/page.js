"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar-adp";
import { updateUsernameAction } from "../../lib/action";
import { Inknut_Antiqua, Kaushan_Script } from "next/font/google";

const inknut = Inknut_Antiqua({ subsets: ["latin"], weight: ["400", "700"] });
const kaushan = Kaushan_Script({ subsets: ["latin"], weight: ["400"] });

export default function ProfilePetugas() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [editMode, setEditMode] = useState(false);
  
  useEffect(() => {
    async function loadSession() {
      const res = await fetch("/api/auth/session");
      const data = await res.json();

      setUsername(data?.user?.name || "");
      setEmail(data?.user?.email || "");
      setUserId(data?.user?.id || "");
    }
    loadSession();
  }, []);

  async function saveChanges() {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("userId", userId);

    const res = await updateUsernameAction(formData);

    if (res.success) {
      await fetch("/api/auth/session?update", { cache: "no-store" });
      alert("Username diperbarui");
      setEditMode(false);
    } else {
      alert("Gagal update");
    }
  }

  return (
    <div className="min-h-screen flex bg-[#FAF7F2]">
      <Sidebar />
      <div className="ml-[245px] w-full p-10">
        <h1 className={`${inknut.className} text-3xl font-bold mb-10`}>Halaman Profile kamu</h1>
        <div className="border border-purple-300 rounded-xl p-10 shadow-sm bg-white max-w-4xl">

          <div className="flex items-start gap-10">
            <div className="w-40 h-34 mt-4">
              <img src="./sidebar-home/account.png" alt="profile" className="w-full h-full"/>
            </div>

            <div className="flex flex-col w-full gap-8">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Username</label>
                <div className="relative">
                  <input type="text" disabled={!editMode} value={username} onChange={(e) => setUsername(e.target.value)}
                    className={`w-full border border-blue-900 rounded-full px-4 py-2 focus:outline-none 
                    ${editMode ? "bg-white" : "bg-gray-100"}`}/>

                  {!editMode && (
                    <button onClick={() => setEditMode(true)} className="absolute right-4 top-2.5">
                      <img src="./sidebar-home/edit-text.png" alt="edit" className="w-5 opacity-80 hover:opacity-100"/>
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Email</label>
                <div className="relative">
                  <input type="text" disabled value={email}
                    className="w-full border border-blue-900 rounded-full px-4 py-2 bg-gray-100"/>
                </div>
              </div>

              {editMode && (
                <button onClick={saveChanges} className="mt-2 w-32 bg-blue-900 text-white rounded-full py-2 hover:bg-black">Simpan</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}