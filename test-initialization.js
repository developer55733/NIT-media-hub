// Test script to verify initialization
console.log('🧪 Test script loaded');

// Test if AppInitializer is working
setTimeout(() => {
    console.log('🔍 Checking if AppInitializer is working...');
    
    if (window.appInitializer) {
        console.log('✅ AppInitializer found:', window.appInitializer);
        console.log('📊 Is loaded:', window.appInitializer.isLoaded);
    } else {
        console.log('❌ AppInitializer not found');
    }
    
    // Test if other systems are available
    const systems = ['authSystem', 'contentInteractions', 'mediaPlayer', 'demoContent', 'uniHubApp'];
    systems.forEach(system => {
        if (window[system]) {
            console.log(`✅ ${system} found:`, typeof window[system]);
        } else {
            console.log(`❌ ${system} not found`);
        }
    });
    
    // Test DOM elements
    const testElements = [
        'videos', 'music', 'games', 'courses', 'posts',
        'auth-modal', 'upload-modal', 'notification-modal',
        'search-input', 'theme-toggle', 'user-avatar'
    ];
    
    testElements.forEach(elementId => {
        const element = document.getElementById(elementId);
        if (element) {
            console.log(`✅ Element found: ${elementId}`);
        } else {
            console.log(`❌ Element not found: ${elementId}`);
        }
    });
}, 2000);
