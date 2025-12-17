class CustomNavbar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header class="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <a href="/" class="flex items-center gap-2 font-bold text-gray-900">
              <span class="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-blue-600 text-white">TE</span>
              <span>TalentEngage AI</span>
            </a>

            <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
              <a class="hover:text-blue-600" href="#ai-features">AI Stack</a>
              <a class="hover:text-blue-600" href="#services">Services</a>
              <a class="hover:text-blue-600" href="#ai-matchmaker">Matchmaker</a>
              <a class="hover:text-blue-600" href="#ai-resume">Resume</a>
              <a class="hover:text-blue-600" href="#chatbot">Chat</a>
              <a class="hover:text-blue-600" href="#about">About</a>
              <a class="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg" href="#contact">
                Contact
              </a>
            </nav>

            <button id="navToggle" class="md:hidden inline-flex items-center justify-center p-2 rounded-lg border border-gray-200">
              <span class="sr-only">Open menu</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>

          <div id="mobileMenu" class="md:hidden hidden pb-4">
            <div class="flex flex-col gap-2 text-sm font-medium text-gray-700">
              <a class="py-2 hover:text-blue-600" href="#ai-features">AI Stack</a>
              <a class="py-2 hover:text-blue-600" href="#services">Services</a>
              <a class="py-2 hover:text-blue-600" href="#ai-matchmaker">Matchmaker</a>
              <a class="py-2 hover:text-blue-600" href="#ai-resume">Resume</a>
              <a class="py-2 hover:text-blue-600" href="#chatbot">Chat</a>
              <a class="py-2 hover:text-blue-600" href="#about">About</a>
              <a class="py-2 text-blue-700" href="#contact">Contact</a>
            </div>
          </div>
        </div>
      </header>
    `;

    const toggle = this.querySelector("#navToggle");
    const menu = this.querySelector("#mobileMenu");
    if (toggle && menu) {
      toggle.addEventListener("click", () => {
        menu.classList.toggle("hidden");
      });
    }
  }
}

customElements.define("custom-navbar", CustomNavbar);
