class CustomFooter extends HTMLElement {
  connectedCallback() {
    const year = new Date().getFullYear();
    this.innerHTML = `
      <footer class="bg-gray-900 text-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <div class="flex items-center gap-2 font-bold text-white text-lg">
                <span class="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-blue-600 text-white">TE</span>
                <span>TalentEngage AI</span>
              </div>
              <p class="text-sm text-gray-400 mt-3 max-w-sm">
                AI-powered recruiting for high-growth teams. Human expertise + automation for faster, higher-quality hires.
              </p>
            </div>

            <div>
              <h3 class="text-sm font-semibold text-white mb-3">Links</h3>
              <ul class="space-y-2 text-sm">
                <li><a class="hover:text-white" href="#services">Services</a></li>
                <li><a class="hover:text-white" href="#ai-matchmaker">AI Matchmaker</a></li>
                <li><a class="hover:text-white" href="#ai-resume">Resume Analyzer</a></li>
                <li><a class="hover:text-white" href="#chatbot">Recruiter Chat</a></li>
              </ul>
            </div>

            <div>
              <h3 class="text-sm font-semibold text-white mb-3">Contact</h3>
              <p class="text-sm text-gray-400">
                Use the contact form above, or add your email + Calendly link here when ready.
              </p>
              <div class="mt-3 text-sm">
                <div class="text-gray-300">Domain: talentengagements.com</div>
              </div>
            </div>
          </div>

          <div class="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between gap-3 text-xs text-gray-400">
            <div>© ${year} TalentEngage AI. All rights reserved.</div>
            <div class="space-x-3">
              <a class="hover:text-white" href="#contact">Contact</a>
              <a class="hover:text-white" href="#about">About</a>
            </div>
          </div>
        </div>
      </footer>
    `;
  }
}

customElements.define("custom-footer", CustomFooter);
