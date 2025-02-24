export function setupFilters(filterNotes, searchNotes) {
  const searchInput = document.createElement("input");
  const filterContainer = document.createElement("div");

  searchInput.type = "text";
  searchInput.placeholder = "Cari catatan...";
  searchInput.className =
    "w-full mb-4 p-3 border rounded-lg shadow-sm focus:outline-blue-500";

  // Tombol Filter Kategori
  const filterButtons = document.createElement("div");
  filterButtons.className =
    "flex space-x-4 mb-4 mr-6 bg-white p-2 rounded-lg shadow-lg";

  const allButton = document.createElement("button");
  allButton.innerHTML = `<i class="fa fa-list"></i> Semua Kategori`;
  allButton.className =
    "text-blue-500 p-2 rounded-md hover:bg-blue-100 focus:outline-none";
  allButton.title = "Tampilkan semua catatan";
  allButton.addEventListener("click", () => {
    filterNotes("all");
    localStorage.setItem("selectedCategory", "all");
  });

  const activeButton = document.createElement("button");
  activeButton.innerHTML = `<i class="fa fa-circle"></i> Aktif`;
  activeButton.className =
    "text-green-500 p-2 rounded-md hover:bg-green-100 focus:outline-none";
  activeButton.title = "Tampilkan catatan aktif";
  activeButton.addEventListener("click", () => {
    filterNotes("active");
    localStorage.setItem("selectedCategory", "active");
  });

  const archivedButton = document.createElement("button");
  archivedButton.innerHTML = `<i class="fa fa-archive"></i> Arsip`;
  archivedButton.className =
    "text-yellow-500 p-2 rounded-md hover:bg-yellow-100 focus:outline-none";
  archivedButton.title = "Tampilkan catatan yang diarsipkan";
  archivedButton.addEventListener("click", () => {
    filterNotes("archived");
    localStorage.setItem("selectedCategory", "archived");
  });

  filterButtons.append(allButton, activeButton, archivedButton);

  filterContainer.className = "mb-4 flex justify-between items-center";
  filterContainer.append(filterButtons, searchInput);

  document
    .querySelector("main")
    .insertBefore(filterContainer, document.getElementById("notesList"));

  // Pencarian
  searchInput.addEventListener("input", (e) => {
    searchNotes(e.target.value);
  });
}
