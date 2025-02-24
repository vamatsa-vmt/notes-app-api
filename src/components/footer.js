class AppFooter extends HTMLElement {
  connectedCallback() {
    const footerText =
      this.getAttribute("footer-text") || "Hak Cipta &copy; 2025 Notes App";

    this.innerHTML = `
      <footer class="text-center mt-8 bg-gray-800 p-4 font-bold">
        <p class="text-sm text-white">${footerText}</p>
      </footer>
    `;
  }
}

customElements.define("app-footer", AppFooter);
