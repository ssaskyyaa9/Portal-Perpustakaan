"use server";

import connection from "./database";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "../app/api/auth/[...nextauth]/route";

// ======== REGISTER ==========
export async function register(formData) {
  try {
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.execute(
      "INSERT INTO users (username, email, password, role, is_verified) VALUES (?, ?, ?, ?, ?)",
      [username, email, hashedPassword, "user", "menunggu"]
    );

    return { success: true, message: "Daftar berhasil", redirect: "/login", };
  } catch (error) {
    console.error("register error:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return { success: false, message: "Email sudah terdaftar" };
    }

    return { success: false, message: "Terjadi kesalahan" };
  }
}

// ========== UNTUK ADMIN ==========
export async function getPendingUsers() {
  try {
    const [rows] = await connection.execute(
      "SELECT id, username, email, role, is_verified FROM users WHERE is_verified = 'menunggu'"
    );

    return rows; 
  } catch (err) {
    console.error("getPendingUsers error:", err);
    return [];
  }
}

export async function approveUser(id) {
  try {
    await connection.execute(
      "UPDATE users SET is_verified = 'disetujui' WHERE id = ?",
      [id]
    );
    return { success: true, message: "User disetujui" };
  } catch (err) {
    console.error("approveUser error:", err);
    return { success: false, message: "Terjadi kesalahan" };
  }
}

export async function rejectUser(id) {
  try {
    await connection.execute(
      "UPDATE users SET is_verified = 'ditolak' WHERE id = ?",
      [id]
    );
    return { success: true, message: "User ditolak" };
  } catch (err) {
    console.error("rejectUser error:", err);
    return { success: false, message: "Terjadi kesalahan" };
  }
}

// ======== CEK STATUS USER =========
export async function refreshUser(email) {
  try {
    const [rows] = await connection.execute(
      "SELECT role, is_verified FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) return { status: "not_found" };

    return {
      status: "ok",
      role: rows[0].role,
      is_verified: rows[0].is_verified,
    };
  } catch (err) {
    console.error("refreshUser error:", err);
    return { status: "error" };
  }
}

// =========== CHECK STATUS =============
export async function checkUserStatus(email) {
  if (!email) {
    return { status: "error", message: "Email wajib diisi" };
  }

  try {
    const [rows] = await connection.execute(
      "SELECT role, is_verified FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return { status: "not_found", message: "User tidak ditemukan" };
    }

    return {
      status: rows[0].is_verified,  // menunggu / disetujui / ditolak
      role: rows[0].role
    };
  } catch (err) {
    console.error("checkUserStatus error:", err);
    return { status: "error", message: "Server error" };
  }
}

//======== UPDATE USERNAME ==========
export async function updateUsernameAction(formData) {
  const username = formData.get("username");
  const userId = formData.get("userId");

  await connection.execute(
    "UPDATE users SET username = ? WHERE id = ?",
    [username, userId]
  );

  return { success: true };
}

//========== KHUSUS CRUD BUKU ==============
export async function getBooks() {
  const [rows] = await connection.execute("SELECT * FROM books ORDER BY id DESC");
  return rows;
}

export async function addBook(form) {
  await connection.execute(`INSERT INTO books (judul, penulis, kategori, cover_url, stok, lokasi_rak, sinopsis) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      form.judul,
      form.penulis,
      form.kategori,
      form.cover_url,
      form.stok,
      form.lokasi_rak,
      form.sinopsis
    ]
  );
  return { success: true };
}

export async function deleteBook(id) {
  await connection.execute("DELETE FROM books WHERE id = ?", [id]);
  return { success: true };
}

export async function updateBook(id, form) {
  await connection.execute(
    `UPDATE books 
     SET judul = ?, penulis = ?, kategori = ?, cover_url = ?, stok = ?, lokasi_rak = ?, sinopsis = ?
     WHERE id = ?`,
    [
      form.judul,
      form.penulis,
      form.kategori,
      form.cover_url,
      form.stok,
      form.lokasi_rak,
      form.sinopsis,
      id
    ]
  );
  return { success: true };
}

export async function getBookById(id) {
  if (!id) return null;
  const [rows] = await connection.execute(
    "SELECT * FROM books WHERE id = ?",
    [Number(id)]
  );
  return rows[0] || null;
}

// ======== KELOLA USER (ADMIN) ==========
export async function getAllVerifiedUsers() {
  try {
    const [rows] = await connection.execute(
      "SELECT id, username, email, role, created_at FROM users WHERE is_verified = 'disetujui'"
    );
    return rows;
  } catch (err) {
    console.error("getAllVerifiedUsers error:", err);
    return [];
  }
}

// Hapus user
export async function deleteUser(id) {
  try {
    await connection.execute("DELETE FROM users WHERE id = ?", [id]);
    return { success: true };
  } catch (err) {
    console.error("deleteUser error:", err);
    return { success: false };
  }
}

export async function createUser(data) {
  const { username, email, password, role } = data;
  const hashed = await bcrypt.hash(password, 10);

  const [result] = await connection.query(
    "INSERT INTO users (username, email, password, role, is_verified, created_at) VALUES (?, ?, ?, ?, 'disetujui', NOW())",
    [username, email, hashed, role]
  );
  return result;
}

export async function searchUsers(keyword) {
  const [rows] = await connection.query(
    "SELECT id, username, email, role, created_at FROM users WHERE role != 'admin' AND is_verified='disetujui' AND username LIKE ? ORDER BY id DESC",
    [`%${keyword}%`]
  );

  return rows;
}

export async function addUser(formData) {
  const username = formData.get("username");
  const email = formData.get("email");
  const password = await bcrypt.hash(formData.get("password"), 10);
  const role = formData.get("role");

  await connection.execute(
    "INSERT INTO users (username, email, password, role, is_verified) VALUES (?, ?, ?, ?, 'disetujui')",
    [username, email, password, role]
  );
}

export async function updateUser(id, data) {
  try {
    await connection.execute(
      "UPDATE users SET username=?, email=?, role=? WHERE id=?",
      [data.username, data.email, data.role, id]
    );
    return { success: true };
  } catch (err) {
    console.error("updateUser error:", err);
    return { success: false };
  }
}

//========= 3 BOX PINK ==========
export async function getDashboardData(role) {
  let result = {};

  if (role === "admin") {
    const [users] = await connection.execute("SELECT COUNT(*) AS total FROM users");
    const [verified] = await connection.execute("SELECT COUNT(*) AS total FROM users WHERE is_verified = 'disetujui'");
    const [pending] = await connection.execute("SELECT COUNT(*) AS total FROM users WHERE is_verified = 'menunggu'");
    
    result = {
      box1: users[0].total,
      box2: verified[0].total,
      box3: pending[0].total,
    };
  }

  if (role === "petugas") {
  const [books] = await connection.execute("SELECT COUNT(*) AS total FROM books");
  const [dipinjam] = await connection.execute("SELECT COUNT(*) AS total FROM peminjaman WHERE status IN ('disetujui', 'dipinjam')");
  const [stok] = await connection.execute("SELECT COUNT(*) AS total FROM books WHERE stok > 0");

  result = {
    box1: books[0].total,
    box2: dipinjam[0].total,
    box3: stok[0].total,
  };
}
  return result;
}

// ===========================================
function tanggalWIB(date) {
  return new Date(date.getTime() - (7 * 60 * 60 * 1000)) 
    .toISOString()
    .split("T")[0];
}

// =========== KHUSUS PEMINJAMAN =========
export async function getPeminjaman() {
  const [rows] = await connection.execute(`
    SELECT 
      p.id,
      u.username AS username,
      b.judul AS judul_buku,
      p.tanggal_pinjam,
      p.tanggal_disetujui,
      p.tanggal_deadline,
      p.tanggal_dikembalikan,
      p.status
    FROM peminjaman p
    JOIN users u ON p.user_id = u.id
    JOIN books b ON p.book_id = b.id
    ORDER BY p.id DESC
  `);

  return rows;
}

export async function getPeminjamanByUser(userId) {
  if (!userId) return [];

  const [rows] = await connection.execute(
    `
    SELECT
      p.id,
      b.judul AS judul_buku,
      p.tanggal_pinjam,
      p.tanggal_disetujui,
      p.tanggal_deadline,
      p.tanggal_dikembalikan,
      p.status
    FROM peminjaman p
    JOIN books b ON p.book_id = b.id
    WHERE p.user_id = ?
    ORDER BY p.id DESC
    `,
    [userId]
  );

  return rows;
}

export async function deletePeminjaman(id) {
  await connection.execute(`DELETE FROM peminjaman WHERE id = ?`, [id]);

  return { success: true };
}

// TERIMA PEMINJAMAN
export async function terimaPeminjaman(id) {
  const today = new Date();
  const deadline = new Date();
  deadline.setDate(today.getDate() + 7);

  await connection.execute(
    `UPDATE peminjaman 
     SET status = 'disetujui', 
         tanggal_disetujui = ?, 
         tanggal_deadline = ? 
     WHERE id = ?`,
    [
      tanggalWIB(today),
      tanggalWIB(deadline),
      id
    ]
  );

  // --- Ambil book_id dari peminjaman ---
  const [rows] = await connection.execute(
    "SELECT book_id FROM peminjaman WHERE id = ?",
    [id]
  );

  const idBuku = rows[0]?.book_id;

  // --- Kurangi stok buku ---
  if (idBuku) {
    await connection.execute(
      "UPDATE books SET stok = stok - 1 WHERE id = ?",
      [idBuku]
    );
  }
}

// TOLAK PEMINJAMAN
export async function tolakPeminjaman(id) {
  await connection.execute(`
    UPDATE peminjaman 
    SET status = 'ditolak'
    WHERE id = ?
  `, [id]);
}

//=======================================
export async function pinjamBuku(data) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return { success: false, message: "Kamu harus login untuk meminjam buku." };
  }

  const userId = session.user.id;
  const bookId = data.book_id;

  if (!bookId) {
    return { success: false, message: "Book ID tidak ditemukan." };
  }

  try {
    // CEK STOK
    const [cekStok] = await connection.execute(
      "SELECT stok FROM books WHERE id = ?",
      [bookId]
    );

    if (!cekStok.length || cekStok[0].stok <= 0) {
      return { success: false, message: "Stok buku habis." };
    }

    // CEK DUPLIKAT PINJAMAN
    const [cekDuplikat] = await connection.execute(
      `
      SELECT id FROM peminjaman 
      WHERE user_id = ? AND book_id = ? 
        AND status IN ('menunggu', 'disetujui')
      `,
      [userId, bookId]
    );

    if (cekDuplikat.length > 0) {
      return { success: false, message: "Kamu sudah mengajukan peminjaman buku ini." };
    }

    // 1. Tambah pengajuan peminjaman
    await connection.execute(
      `
      INSERT INTO peminjaman (user_id, book_id, tanggal_pinjam, status)
      VALUES (?, ?, CURDATE(), 'menunggu')
      `,
      [userId, bookId]
    );

    return { success: true, message: "Peminjaman berhasil diajukan!" };

  } catch (error) {
    console.error("Peminjaman error:", error);
    return { success: false, message: "Terjadi kesalahan saat meminjam buku." };
  }
}

export async function kembalikanPeminjaman(id) {
  const [rows] = await connection.execute(
    "SELECT book_id FROM peminjaman WHERE id = ?",
    [id]
  );

  const idBuku = rows[0]?.book_id;

  if (!idBuku) {
    return { success: false, message: "ID Buku tidak ditemukan." };
  }

  await connection.execute(
    "UPDATE books SET stok = stok + 1 WHERE id = ?",
    [idBuku]
  );

 await connection.execute(
  `
  UPDATE peminjaman 
  SET status = 'dikembalikan', tanggal_dikembalikan = CURDATE()
  WHERE id = ?
  `,
  [id]
);

  return { success: true, message: "Buku telah dikembalikan!" };
}

//========= UNTUK LIKE ======
// Tambah ke buku disukai
export async function likeBook({ user_email, book_id }) {
  await connection.execute(
    "INSERT IGNORE INTO liked_books (user_email, book_id) VALUES (?, ?)",
    [user_email, book_id]
  );
  return { success: true };
}

// Hapus dari disukai
export async function unlikeBook({ user_email, book_id }) {
  await connection.execute(
    "DELETE FROM liked_books WHERE user_email = ? AND book_id = ?",
    [user_email, book_id]
  );
  return { success: true };
}

// Ambil buku disukai berdasarkan email user
export async function getLikedBooks(user_email) {
  const [rows] = await connection.execute(`
    SELECT books.*
    FROM liked_books
    JOIN books ON books.id = liked_books.book_id
    WHERE liked_books.user_email = ?
    ORDER BY liked_books.id DESC
  `, [user_email]);

  return rows;
}