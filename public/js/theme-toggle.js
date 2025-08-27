// Theme Toggle Functionality
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'light';
    console.log('ThemeManager initialized with theme:', this.theme);
    this.init();
  }

  init() {
    // Set initial theme
    this.setTheme(this.theme);
    
    // Add event listeners to theme toggle buttons
    this.addEventListeners();
    
    // Also listen for DOM changes in case theme toggles are added dynamically
    this.observeDOM();
    
    console.log('ThemeManager initialization complete');
  }

  addEventListeners() {
    const themeToggles = document.querySelectorAll('.theme-toggle');
    console.log('Found theme toggles:', themeToggles.length);
    
    themeToggles.forEach((toggle, index) => {
      // Remove existing listeners to prevent duplicates
      toggle.removeEventListener('click', this.toggleTheme.bind(this));
      toggle.addEventListener('click', (e) => {
        console.log('Theme toggle clicked:', index);
        this.toggleTheme();
      });
      console.log(`Added event listener to theme toggle ${index}`);
    });
  }

  observeDOM() {
    // Use MutationObserver to detect when new theme toggles are added
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const themeToggles = document.querySelectorAll('.theme-toggle');
          if (themeToggles.length > 0) {
            console.log('New theme toggles detected, re-adding event listeners');
            this.addEventListeners();
          }
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  setTheme(theme) {
    console.log('Setting theme to:', theme);
    this.theme = theme;
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update toggle button icons
    this.updateToggleIcons();
    
    // Dispatch custom event for other scripts to listen to
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    
    console.log('Theme set successfully');
  }

  toggleTheme() {
    const newTheme = this.theme === 'light' ? 'dark' : 'light';
    console.log('Toggling theme from', this.theme, 'to', newTheme);
    this.setTheme(newTheme);
  }

  updateToggleIcons() {
    const themeToggles = document.querySelectorAll('.theme-toggle');
    themeToggles.forEach((toggle, index) => {
      const icon = toggle.querySelector('i');
      if (icon) {
        if (this.theme === 'light') {
          icon.className = 'bi bi-moon-stars-fill';
          toggle.setAttribute('title', 'Switch to Dark Mode');
        } else {
          icon.className = 'bi bi-sun-fill';
          toggle.setAttribute('title', 'Switch to Light Mode');
        }
        console.log(`Updated icon for theme toggle ${index} to:`, icon.className);
      }
    });
  }

  // Public method to get current theme
  getCurrentTheme() {
    return this.theme;
  }

  // Public method to set theme from external scripts
  setThemeFromExternal(theme) {
    this.setTheme(theme);
  }
}

// Initialize theme manager when DOM is ready
let themeManager;

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing ThemeManager');
  // Initialize theme manager
  themeManager = new ThemeManager();
  
  // Add smooth transition class after page load
  setTimeout(() => {
    document.body.classList.add('theme-loaded');
    console.log('Added theme-loaded class');
  }, 100);
});

// Also initialize if DOM is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (!themeManager) {
      console.log('DOM was loading, initializing ThemeManager');
      themeManager = new ThemeManager();
    }
  });
} else {
  // DOM is already loaded
  if (!themeManager) {
    console.log('DOM already loaded, initializing ThemeManager');
    themeManager = new ThemeManager();
  }
}

// Make themeManager available globally for debugging
window.themeManager = themeManager;

// Add a global function for manual testing
window.testThemeToggle = function() {
  if (themeManager) {
    console.log('Current theme:', themeManager.getCurrentTheme());
    themeManager.toggleTheme();
  } else {
    console.log('ThemeManager not initialized');
  }
};
