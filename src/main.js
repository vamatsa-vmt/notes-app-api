import {
  getNotes,
  addNote,
  deleteNote,
  archiveNote,
  unarchiveNote,
  getArchivedNotes,
} from "./utils/api";
import "./components/header";
import "./components/form";
import "./components/footer";
import { setupFilters } from "./utils/filter";

const main = async () => {
  document.addEventListener("DOMContentLoaded", async () => {
    const notesList = document.getElementById("notesList");
    let notesData = [];
    let currentCategory = localStorage.getItem("selectedCategory") || "all";
    let searchKeyword = "";

    const showLoading = () => {
      notesList.innerHTML = `<div class="text-center text-gray-500">Memuat...</div>`;
    };

    const loadNotes = async () => {
      showLoading();
      try {
        const activeNotes = await getNotes();
        const archivedNotes = await getArchivedNotes();
        notesData = [...activeNotes, ...archivedNotes];
        filterNotes(currentCategory);
      } catch (error) {
        Swal.fire("Gagal Memuat Data!", error.message, "error");
      }
    };

    document.addEventListener("note-added", async () => {
      await loadNotes();
    });

    const renderNotes = (notes = []) => {
      notesList.innerHTML = notes.length
        ? notes
            .map(
              (note) => `
            <article class="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition duration-300">
              <h3 class="text-lg font-semibold text-gray-900">${note.title}</h3>
              <p class="text-sm text-gray-600 mt-2">${note.body}</p>
              <div class="mt-4 flex justify-between items-center">
                <time class="text-xs text-gray-500">${new Date(note.createdAt).toLocaleString()}</time>
                <div class="flex gap-2">
                  <button class="text-red-500 text-xl" data-id="${note.id}" data-action="delete" title="Hapus Catatan">
                    <i class="fa fa-trash"></i>
                  </button>
                  <button class="${note.archived ? "text-green-500" : "text-yellow-500"} text-xl" 
                    data-id="${note.id}" data-action="archive" 
                    title="${note.archived ? "Kembalikan dari Arsip" : "Arsipkan Catatan"}">
                    <i class="fa ${note.archived ? "fa-undo" : "fa-archive"}"></i>
                  </button>  
                </div>
              </div>
            </article>`
            )
            .join("")
        : `<p class="text-center text-gray-500">Tidak ada catatan yang ditemukan.</p>`;

      notesList.querySelectorAll("button").forEach((btn) => {
        const id = btn.dataset.id;
        const action = btn.dataset.action;
        if (action === "delete")
          btn.addEventListener("click", () => deleteNoteAndRefresh(id));
        if (action === "archive")
          btn.addEventListener("click", () => archiveNoteAndRefresh(id));
      });
    };

    const archiveNoteAndRefresh = async (id) => {
      const note = notesData.find((n) => n.id === id);
      if (!note) return;

      try {
        if (note.archived) {
          await unarchiveNote(id);
        } else {
          await archiveNote(id);
        }
        await loadNotes();
      } catch (error) {
        Swal.fire("Gagal Mengarsipkan!", error.message, "error");
      }
    };

    const deleteNoteAndRefresh = async (id) => {
      const confirmDelete = await Swal.fire({
        title: "Yakin ingin menghapus catatan ini?",
        text: "Catatan yang dihapus tidak bisa dikembalikan!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, hapus!",
      });

      if (confirmDelete.isConfirmed) {
        try {
          await deleteNote(id);
          await loadNotes();
        } catch (error) {
          Swal.fire("Gagal Menghapus!", error.message, "error");
        }
      }
    };

    const filterNotes = (category) => {
      currentCategory = category;
      localStorage.setItem("selectedCategory", category);
      let filteredNotes = notesData;

      if (category === "archived") {
        filteredNotes = filteredNotes.filter((note) => note.archived);
      } else if (category === "active") {
        filteredNotes = filteredNotes.filter((note) => !note.archived);
      }
      searchNotes(searchKeyword, filteredNotes);
    };

    const searchNotes = (keyword, filteredNotes = notesData) => {
      searchKeyword = keyword.toLowerCase();
      const searchedNotes = filteredNotes.filter(
        (note) =>
          note.title.toLowerCase().includes(searchKeyword) ||
          note.body.toLowerCase().includes(searchKeyword)
      );
      renderNotes(searchedNotes);
    };

    document.addEventListener("add-note", async (event) => {
      await addNote(event.detail.title, event.detail.body);
      await loadNotes();
    });

    setupFilters(filterNotes, searchNotes);
    await loadNotes();
  });
};
export default main;
