import { addNote } from "../utils/api";
class AppForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const formTitle = this.getAttribute("form-title") || "Tambah Catatan Baru";

    const style = document.createElement("style");
    style.textContent = `
      @import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.1.2/dist/tailwind.min.css');
    `;
    this.shadowRoot.appendChild(style);

    this.shadowRoot.innerHTML += `
      <section class="mb-8 bg-blue-100 p-6 rounded-lg shadow-lg">
        <form id="addNoteForm" class="space-y-4">
        <h2 class="text-2xl font-bold text-blue-700 mb-6">Tambah Catatan Baru</h2>
          <div>
            <label for="title" class="block text-sm font-bold text-gray-700 mb-3">Judul</label>
            <input
              type="text"
              id="title"
              name="title"
              class="w-full p-3 mb-4 border rounded-md"
              placeholder="Masukkan judul catatan"
              aria-describedby="titleError"
              required
            />
            </div>
            <span id="titleError" class="bg-red-100 p-2 text-red-500 font-bold hidden">Input judul wajib diisi.</span>
            <div>
            <label for="body" class="block text-sm font-bold text-gray-700 mb-3">Isi Catatan</label>
            <textarea
              id="body"
              name="body"
              class="w-full p-3 mb-4 border rounded-md"
              placeholder="Masukkan isi catatan"
              rows="4"
              aria-describedby="bodyError"
              required
            ></textarea>
            <span id="bodyError" class="bg-red-100 p-2 text-red-500 font-bold hidden">Input isi catatan wajib diisi.</span>
          </div>

          <button
            type="submit"
            class="w-full py-2 bg-blue-500 font-bold text-white rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Tambah Catatan
          </button>
        </form>
      </section>
    `;

    // Real-time validation
    const titleInput = this.shadowRoot.querySelector("#title");
    const bodyInput = this.shadowRoot.querySelector("#body");

    titleInput.addEventListener("submit", async (event) => {
      const titleError = this.shadowRoot.querySelector("#titleError");
      if (titleInput.value.trim()) {
        titleError.classList.add("hidden");
      } else {
        titleError.classList.remove("hidden");
      }
    });

    bodyInput.addEventListener("input", () => {
      const bodyError = this.shadowRoot.querySelector("#bodyError");
      if (bodyInput.value.trim()) {
        bodyError.classList.add("hidden");
      } else {
        bodyError.classList.remove("hidden");
      }
    });

    // Form Submission
    const form = this.shadowRoot.querySelector("#addNoteForm");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const title = this.shadowRoot.querySelector("#title").value.trim();
      const body = this.shadowRoot.querySelector("#body").value.trim();

      if (!title || !body) {
        Swal.fire("Oops!", "Judul dan isi catatan wajib diisi.", "warning");
        return;
      }

      try {
        await addNote(title, body);
        Swal.fire("Berhasil!", "Catatan berhasil ditambahkan.", "success");
        form.reset();
        document.dispatchEvent(new CustomEvent("note-added"));
      } catch (error) {
        Swal.fire("Gagal!", "Terjadi kesalahan saat menambahkan catatan.", "error");
      }
    });
  }
}

customElements.define("app-form", AppForm);
