// Theme management functionality

class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        this.themeToggle = null;
        
        this.init();
    }
    
    init() {
        this.applyTheme(this.currentTheme);
        this.setupThemeToggle();
        this.setupSystemThemeListener();
        this.setupThemeTransitions();
    }
    
    // Apply theme to document
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        this.updateThemeToggleIcon();
        
        // Dispatch theme change event
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: theme }
        }));
    }
    
    // Toggle between light and dark themes
    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
        
        // Add transition effect
        this.addThemeTransition();
    }
    
    // Setup theme toggle button
    setupThemeToggle() {
        this.themeToggle = document.getElementById('themeToggle');
        
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
            
            // Add keyboard support
            this.themeToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleTheme();
                }
            });
            
            // Set initial icon
            this.updateThemeToggleIcon();
        }
    }
    
    // Update theme toggle icon
    updateThemeToggleIcon() {
        if (!this.themeToggle) return;
        
        const icon = this.themeToggle.querySelector('svg');
        if (!icon) return;
        
        if (this.currentTheme === 'dark') {
            // Sun icon for dark theme (to switch to light)
            icon.innerHTML = `
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            `;
            this.themeToggle.setAttribute('aria-label', 'Switch to light theme');
            this.themeToggle.setAttribute('title', 'Switch to light theme');
        } else {
            // Moon icon for light theme (to switch to dark)
            icon.innerHTML = `
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            `;
            this.themeToggle.setAttribute('aria-label', 'Switch to dark theme');
            this.themeToggle.setAttribute('title', 'Switch to dark theme');
        }
    }
    
    // Listen for system theme changes
    setupSystemThemeListener() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        mediaQuery.addEventListener('change', (e) => {
            this.systemPreference = e.matches ? 'dark' : 'light';
            
            // Only auto-switch if user hasn't manually set a preference
            if (!localStorage.getItem('theme')) {
                this.applyTheme(this.systemPreference);
            }
        });
    }
    
    // Add smooth transition when changing themes
    addThemeTransition() {
        const transitionClass = 'theme-transition';
        
        // Add transition class
        document.documentElement.classList.add(transitionClass);
        
        // Remove after transition completes
        setTimeout(() => {
            document.documentElement.classList.remove(transitionClass);
        }, 300);
    }
    
    // Setup theme transition styles
    setupThemeTransitions() {
        if (!document.querySelector('#theme-transition-styles')) {
            const style = document.createElement('style');
            style.id = 'theme-transition-styles';
            style.textContent = `
                .theme-transition,
                .theme-transition *,
                .theme-transition *:before,
                .theme-transition *:after {
                    transition: background-color 0.3s ease, 
                               color 0.3s ease, 
                               border-color 0.3s ease,
                               box-shadow 0.3s ease !important;
                }
                
                .theme-transition img,
                .theme-transition video,
                .theme-transition iframe {
                    transition: opacity 0.3s ease !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Get current theme
    getCurrentTheme() {
        return this.currentTheme;
    }
    
    // Check if dark theme is active
    isDarkTheme() {
        return this.currentTheme === 'dark';
    }
    
    // Check if light theme is active
    isLightTheme() {
        return this.currentTheme === 'light';
    }
    
    // Set specific theme
    setTheme(theme) {
        if (theme === 'light' || theme === 'dark') {
            this.applyTheme(theme);
        }
    }
    
    // Reset to system preference
    resetToSystemPreference() {
        localStorage.removeItem('theme');
        this.applyTheme(this.systemPreference);
    }
    
    // Get theme preference (user set or system)
    getThemePreference() {
        return localStorage.getItem('theme') || this.systemPreference;
    }
}

// Theme-aware component utilities
class ThemeUtils {
    // Get CSS custom property value
    static getCSSVariable(property) {
        return getComputedStyle(document.documentElement)
            .getPropertyValue(property)
            .trim();
    }
    
    // Set CSS custom property
    static setCSSVariable(property, value) {
        document.documentElement.style.setProperty(property, value);
    }
    
    // Get theme-appropriate color
    static getThemeColor(lightColor, darkColor) {
        const theme = window.themeManager?.getCurrentTheme() || 'dark';
        return theme === 'dark' ? darkColor : lightColor;
    }
    
    // Apply theme-specific styles to element
    static applyThemeStyles(element, lightStyles, darkStyles) {
        const theme = window.themeManager?.getCurrentTheme() || 'dark';
        const styles = theme === 'dark' ? darkStyles : lightStyles;
        
        Object.assign(element.style, styles);
    }
    
    // Create theme-aware media query
    static createThemeMediaQuery(callback) {
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Initial call
        callback(darkModeQuery.matches);
        
        // Listen for changes
        darkModeQuery.addEventListener('change', (e) => {
            callback(e.matches);
        });
        
        return darkModeQuery;
    }
    
    // Generate theme-appropriate gradient
    static generateGradient(colors, direction = '135deg') {
        const theme = window.themeManager?.getCurrentTheme() || 'dark';
        const themeColors = colors[theme] || colors.dark;
        
        return `linear-gradient(${direction}, ${themeColors.join(', ')})`;
    }
    
    // Get contrast ratio between two colors
    static getContrastRatio(color1, color2) {
        const getLuminance = (color) => {
            const rgb = color.match(/\d+/g);
            if (!rgb) return 0;
            
            const [r, g, b] = rgb.map(c => {
                c = parseInt(c) / 255;
                return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
            });
            
            return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        };
        
        const lum1 = getLuminance(color1);
        const lum2 = getLuminance(color2);
        
        return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
    }
    
    // Check if color meets WCAG contrast requirements
    static meetsContrastRequirement(foreground, background, level = 'AA') {
        const ratio = this.getContrastRatio(foreground, background);
        const requirements = {
            'AA': 4.5,
            'AAA': 7,
            'AA-large': 3,
            'AAA-large': 4.5
        };
        
        return ratio >= (requirements[level] || 4.5);
    }
}

// Theme presets
const ThemePresets = {
    // Gaming themes
    gaming: {
        dark: {
            '--primary-color': '#00ff88',
            '--secondary-color': '#ff0080',
            '--accent-color': '#00d4ff',
            '--bg-primary': '#0a0a0a',
            '--bg-secondary': '#1a1a1a',
            '--text-primary': '#ffffff'
        },
        light: {
            '--primary-color': '#00cc6a',
            '--secondary-color': '#cc0066',
            '--accent-color': '#0099cc',
            '--bg-primary': '#ffffff',
            '--bg-secondary': '#f8f9fa',
            '--text-primary': '#212529'
        }
    },
    
    // Cyberpunk theme
    cyberpunk: {
        dark: {
            '--primary-color': '#ff00ff',
            '--secondary-color': '#00ffff',
            '--accent-color': '#ffff00',
            '--bg-primary': '#0d0d0d',
            '--bg-secondary': '#1a0d1a',
            '--text-primary': '#ffffff'
        }
    },
    
    // Retro theme
    retro: {
        dark: {
            '--primary-color': '#ff6b35',
            '--secondary-color': '#f7931e',
            '--accent-color': '#ffd23f',
            '--bg-primary': '#2d1b69',
            '--bg-secondary': '#11052c',
            '--text-primary': '#ffffff'
        }
    }
};

// Apply theme preset
function applyThemePreset(presetName, variant = 'dark') {
    const preset = ThemePresets[presetName];
    if (!preset || !preset[variant]) {
        console.warn(`Theme preset "${presetName}" with variant "${variant}" not found`);
        return;
    }
    
    const styles = preset[variant];
    Object.entries(styles).forEach(([property, value]) => {
        ThemeUtils.setCSSVariable(property, value);
    });
}

// Initialize theme manager
document.addEventListener('DOMContentLoaded', function() {
    window.themeManager = new ThemeManager();
    window.ThemeUtils = ThemeUtils;
    window.ThemePresets = ThemePresets;
    window.applyThemePreset = applyThemePreset;
    
    // Listen for theme changes
    window.addEventListener('themeChanged', function(event) {
        console.log('Theme changed to:', event.detail.theme);
        
        // Update any theme-dependent components
        updateThemeDependentComponents(event.detail.theme);
    });
});

// Update components that depend on theme
function updateThemeDependentComponents(theme) {
    // Update charts, graphs, or other visual components
    updateChartColors(theme);
    
    // Update syntax highlighting if present
    updateSyntaxHighlighting(theme);
    
    // Update any canvas elements
    updateCanvasElements(theme);
}

// Update chart colors based on theme
function updateChartColors(theme) {
    // This would update any charts or graphs in the application
    const charts = document.querySelectorAll('.chart, .graph');
    charts.forEach(chart => {
        // Update chart colors based on theme
        if (chart.updateColors && typeof chart.updateColors === 'function') {
            chart.updateColors(theme);
        }
    });
}

// Update syntax highlighting
function updateSyntaxHighlighting(theme) {
    const codeBlocks = document.querySelectorAll('pre code, .highlight');
    codeBlocks.forEach(block => {
        block.className = block.className.replace(/theme-\w+/, `theme-${theme}`);
    });
}

// Update canvas elements
function updateCanvasElements(theme) {
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach(canvas => {
        // Trigger redraw with new theme colors
        const redrawEvent = new CustomEvent('themeRedraw', {
            detail: { theme: theme }
        });
        canvas.dispatchEvent(redrawEvent);
    });
}

// Accessibility: Respect user's motion preferences
function respectMotionPreferences() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    function updateMotionPreference(mediaQuery) {
        if (mediaQuery.matches) {
            document.documentElement.classList.add('reduce-motion');
        } else {
            document.documentElement.classList.remove('reduce-motion');
        }
    }
    
    updateMotionPreference(prefersReducedMotion);
    prefersReducedMotion.addEventListener('change', updateMotionPreference);
}

// Initialize motion preferences
document.addEventListener('DOMContentLoaded', respectMotionPreferences);

// Export theme manager for global access
window.ThemeManager = ThemeManager;