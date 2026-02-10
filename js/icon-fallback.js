// Icon Fallback System
class IconFallback {
    constructor() {
        this.icons = {
            'fa-home': '🏠',
            'fa-fire': '🔥',
            'fa-th-large': '📱',
            'fa-user': '👤',
            'fa-cog': '⚙️',
            'fa-search': '🔍',
            'fa-video': '📹',
            'fa-music': '🎵',
            'fa-newspaper': '📰',
            'fa-users': '👥',
            'fa-graduation-cap': '🎓',
            'fa-play': '▶️',
            'fa-pause': '⏸️',
            'fa-stop': '⏹️',
            'fa-heart': '❤️',
            'fa-comment': '💬',
            'fa-share': '🔗',
            'fa-bell': '🔔',
            'fa-bars': '☰',
            'fa-times': '✖️',
            'fa-check': '✓',
            'fa-upload': '⬆️',
            'fa-download': '⬇️',
            'fa-plus': '➕',
            'fa-minus': '➖',
            'fa-edit': '✏️',
            'fa-trash': '🗑️',
            'fa-eye': '👁️',
            'fa-calendar': '📅',
            'fa-clock': '🕒',
            'fa-star': '⭐',
            'fa-thumbs-up': '👍',
            'fa-thumbs-down': '👎',
            'fa-broadcast-tower': '📡',
            'fa-list': '📋',
            'fa-play-circle': '▶️',
            'fa-user-circle': '👤',
            'fa-check-circle': '✅',
            'fa-at': '@',
            'fa-paper-plane': '📤',
            'fa-question-circle': '❓'
        };
    }

    // Replace Font Awesome icons with emoji fallbacks
    init() {
        console.log('Initializing icon fallback system...');
        
        // Check if Font Awesome is loaded
        if (!this.isFontAwesomeLoaded()) {
            console.log('Font Awesome not loaded, using emoji fallbacks');
            this.replaceIconsWithEmojis();
        }
    }

    isFontAwesomeLoaded() {
        // Check if Font Awesome CSS is loaded
        const styleSheets = Array.from(document.styleSheets);
        return styleSheets.some(sheet => 
            sheet.href && sheet.href.includes('font-awesome')
        );
    }

    replaceIconsWithEmojis() {
        // Replace all i elements with Font Awesome classes
        const iconElements = document.querySelectorAll('i[class*="fa-"]');
        
        iconElements.forEach(element => {
            const classes = Array.from(element.classList);
            const iconClass = classes.find(cls => cls.startsWith('fa-') && !cls.includes('fa-'));
            
            if (iconClass && this.icons[iconClass]) {
                element.textContent = this.icons[iconClass];
                element.style.fontSize = '1.2em';
                element.style.display = 'inline-block';
                element.style.width = '1em';
                element.style.textAlign = 'center';
            }
        });
    }

    // Add icon test
    testIcons() {
        const testElement = document.createElement('i');
        testElement.className = 'fas fa-home';
        document.body.appendChild(testElement);
        
        setTimeout(() => {
            const computedStyle = window.getComputedStyle(testElement);
            const fontFamily = computedStyle.getPropertyValue('font-family');
            
            if (!fontFamily.includes('Font Awesome')) {
                console.log('Font Awesome not working, enabling fallbacks');
                this.replaceIconsWithEmojis();
            }
            
            document.body.removeChild(testElement);
        }, 100);
    }
}

// Initialize icon fallback
const iconFallback = new IconFallback();

// Initialize after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        iconFallback.init();
        iconFallback.testIcons();
    }, 500);
});
