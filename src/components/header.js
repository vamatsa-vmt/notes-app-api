class AppHeader extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute("title") || "Notes App";
    this.innerHTML = `
      <header class="text-center mb-8">
        <h1 class="text-4xl font-bold text-red-500">${title}</h1>
      </header>
    `;
  }
}

customElements.define("app-header", AppHeader);
