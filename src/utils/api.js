import { async } from "regenerator-runtime";
const BASE_URL = "https://notes-api.dicoding.dev/v2/notes";

export const getNotes = async () => {
  try {
    const response = await fetch(`${BASE_URL}`);
    const result = await response.json();
    if (result.status === "success") return result.data;
    throw new Error(result.message);
  } catch (error) {
    Swal.fire("Gagal Memuat Data!", error.message, "error");
    return [];
  }
};

export const addNote = async (title, body) => {
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body }),
    });
    const result = await response.json();
    if (result.status === "success") return result.data;
    throw new Error(result.message);
  } catch (error) {
    Swal.fire("Gagal Menambahkan Catatan!", error.message, "error");
  }
};

export const deleteNote = async (id) => {
  try {
    await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    Swal.fire("Terhapus!", "Catatan berhasil dihapus.", "success");
  } catch (error) {
    Swal.fire("Gagal Menghapus!", error.message, "error");
  }
};

export const getArchivedNotes = async () => {
  try {
    const response = await fetch(`${BASE_URL}/archived`);
    const result = await response.json();
    if (result.status === "success") return result.data;
    throw new Error(result.message);
  } catch (error) {
    Swal.fire("Gagal Memuat Data Arsip!", error.message, "error");
    return [];
  }
};

export const archiveNote = async (id) => {
  try {
    await fetch(`${BASE_URL}/${id}/archive`, { method: "POST" });
    Swal.fire("Diarsipkan!", "Catatan berhasil diarsipkan.", "success");
  } catch (error) {
    Swal.fire("Gagal Mengarsipkan!", error.message, "error");
  }
};

export const unarchiveNote = async (id) => {
  try {
    await fetch(`${BASE_URL}/${id}/unarchive`, { method: "POST" });
    Swal.fire("Diaktifkan!", "Catatan kembali aktif.", "success");
  } catch (error) {
    Swal.fire("Gagal Mengaktifkan!", error.message, "error");
  }
};
