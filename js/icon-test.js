// Icon Test and Fix
console.log('🔍 Testing Icon Loading...');

// Test if Font Awesome is loaded
function testFontAwesome() {
    // Create test element
    const testElement = document.createElement('i');
    testElement.className = 'fas fa-home';
    testElement.style.cssText = 'position: absolute; top: -1000px; left: -1000px; visibility: hidden;';
    document.body.appendChild(testElement);
    
    // Check if icon is loaded
    setTimeout(() => {
        const computedStyle = window.getComputedStyle(testElement);
        const fontFamily = computedStyle.getPropertyValue('font-family');
        const fontWeight = computedStyle.getPropertyValue('font-weight');
        
        console.log('🎨 Font Family:', fontFamily);
        console.log('⚖️ Font Weight:', fontWeight);
        
        // Remove test element
        document.body.removeChild(testElement);
        
        // Check if Font Awesome is working
        if (fontFamily.includes('Font Awesome') || fontFamily.includes('FontAwesome')) {
            console.log('✅ Font Awesome is loaded correctly!');
            showIconStatus('success');
        } else {
            console.log('❌ Font Awesome is NOT loaded!');
            showIconStatus('failed');
            enableEmojiFallbacks();
        }
    }, 100);
}

// Show icon status
function showIconStatus(status) {
    const statusDiv = document.createElement('div');
    statusDiv.id = 'icon-status';
    statusDiv.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        background: ${status === 'success' ? '#4caf50' : '#f44336'};
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 10000;
        font-family: monospace;
    `;
    statusDiv.textContent = status === 'success' ? '✅ Icons OK' : '❌ Icons Failed';
    document.body.appendChild(statusDiv);
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (statusDiv.parentNode) {
            statusDiv.parentNode.removeChild(statusDiv);
        }
    }, 5000);
}

// Enable emoji fallbacks
function enableEmojiFallbacks() {
    console.log('🔄 Enabling emoji fallbacks...');
    
    const iconMap = {
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
        'fa-question-circle': '❓',
        'fa-cloud-upload-alt': '☁️',
        'fa-broadcast-tower': '📡',
        'fa-graduation-cap': '🎓',
        'fa-th': '📱',
        'fa-large': '📱'
    };
    
    // Replace all Font Awesome icons with emojis
    const iconElements = document.querySelectorAll('i[class*="fa-"]');
    let replacedCount = 0;
    
    iconElements.forEach(element => {
        const classes = Array.from(element.classList);
        const iconClass = classes.find(cls => cls.startsWith('fa-') && cls !== 'fa-solid' && cls !== 'fa-regular' && cls !== 'fa-brands' && cls !== 'fas' && cls !== 'far' && cls !== 'fab');
        
        if (iconClass && iconMap[iconClass]) {
            element.textContent = iconMap[iconClass];
            element.style.fontSize = '1.2em';
            element.style.display = 'inline-block';
            element.style.width = '1em';
            element.style.textAlign = 'center';
            element.style.lineHeight = '1';
            replacedCount++;
        }
    });
    
    console.log(`✅ Replaced ${replacedCount} icons with emoji fallbacks`);
}

// Add CSS to ensure icons are visible
function addIconCSS() {
    const style = document.createElement('style');
    style.textContent = `
        /* Ensure Font Awesome icons are visible */
        .fas, .far, .fab, .fa-solid, .fa-regular, .fa-brands {
            display: inline-block !important;
            font-style: normal !important;
            font-variant: normal !important;
            text-rendering: auto !important;
            line-height: 1 !important;
        }
        
        /* Icon fixes */
        i[class*="fa-"] {
            visibility: visible !important;
            opacity: 1 !important;
        }
        
        /* Header icons */
        .header .fas,
        .header .far,
        .header .fab {
            color: var(--light-color, #ffffff) !important;
            font-size: 1.2rem !important;
        }
        
        /* Sidebar icons */
        .sidebar .fas,
        .sidebar .far,
        .sidebar .fab {
            color: var(--light-color, #ffffff) !important;
            font-size: 1.1rem !important;
            width: 20px !important;
            text-align: center !important;
        }
        
        /* Button icons */
        .btn .fas,
        .btn .far,
        .btn .fab {
            color: inherit !important;
        }
    `;
    document.head.appendChild(style);
}

// Initialize icon test
document.addEventListener('DOMContentLoaded', () => {
    // Add CSS fixes first
    addIconCSS();
    
    // Test Font Awesome after a short delay
    setTimeout(testFontAwesome, 500);
});

// Also test immediately in case DOM is already loaded
if (document.readyState === 'loading') {
    // DOM is still loading
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(testFontAwesome, 500);
    });
} else {
    // DOM is already loaded
    setTimeout(testFontAwesome, 500);
}
