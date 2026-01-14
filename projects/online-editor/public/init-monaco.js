// Initialize Monaco Editor from CDN
(function() {
  console.log('Loading Monaco Editor from CDN...');
  
  // Create and append the Monaco loader script
  var loaderScript = document.createElement('script');
  loaderScript.src = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/loader.js';
  loaderScript.onload = function() {
    console.log('Monaco loader script loaded');
    
    // Configure AMD loader
    if (typeof require !== 'undefined') {
      require.config({ 
        paths: { 
          vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' 
        } 
      });
      console.log('Monaco Editor AMD configured');
      
      // Mark Monaco as ready
      window.__MONACO_READY__ = true;
      window.dispatchEvent(new Event('monaco-ready'));
    }
  };
  loaderScript.onerror = function() {
    console.error('Failed to load Monaco Editor loader script');
  };
  
  document.head.appendChild(loaderScript);
})();
